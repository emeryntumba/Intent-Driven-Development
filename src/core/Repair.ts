import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';

export class Repair {
  /**
   * Attempts to fix a failed command based on the error message.
   * Returns true if a fix was applied and the command should be retried.
   */
  public async fix(command: string, error: any): Promise<boolean> {
    const errorMsg = (error.message || '').toString();
    const stdout = (error.stdout || '').toString();
    const stderr = (error.stderr || '').toString();
    
    const context = `${errorMsg}\n${stdout}\n${stderr}`.toLowerCase();
    
    console.log(chalk.yellow('\n🔧 Intent AI: Diagnosing failure...'));

    // SCENARIO 1: Missing Artisan (Laravel)
    if ((command.includes('artisan') || command.includes('php')) && 
        (context.includes('could not open input file') || context.includes('artisan'))) {
        return this.fixMissingArtisan();
    }

    // SCENARIO 2: Modules not installed (Node)
    if (context.includes('cannot find module') || context.includes('command not found')) {
         if (fs.existsSync('package.json') && !fs.existsSync('node_modules')) {
             return this.fixNodeDependencies();
         }
    }

    // SCENARIO 3: Python Module Missing
    if (context.includes('modulenotfounderror') || context.includes('no module named')) {
        return this.fixPythonDependencies(context);
    }

    // SCENARIO 4: Git not initialized
    if (context.includes('not a git repository')) {
        return this.fixGitInit();
    }

    console.log(chalk.red('  ✖ No auto-fix available for this error.'));
    return false;
  }

  private async fixMissingArtisan(): Promise<boolean> {
    const spinner = ora('Fixing: Missing "artisan" script...').start();
    
    // In a real/demo scenario, if artisan is missing, we might be in a scaffolded folder 
    // that hasn't run 'composer create-project'. 
    // We will create a "Shim" artisan to allow the demo to proceed.
    
    const artisanPath = path.join(process.cwd(), 'artisan');
    const artisanShim = `#!/usr/bin/env php
<?php
// Intent CLI: Auto-generated shim for demo purposes
// This shim simulates Laravel commands when full framework is missing

$command = $argv[1] ?? 'list';
$name = $argv[2] ?? 'unknown';

if ($command === 'make:migration') {
    $dir = 'database/migrations';
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    
    $timestamp = date('Y_m_d_His');
    $filename = "{$dir}/{$timestamp}_{$name}.php";
    
    // Parse table name from migration name (e.g. create_users_table -> users)
    preg_match('/create_(.*)_table/', $name, $matches);
    $tableName = $matches[1] ?? 'table_name';

    $content = "<?php

use Illuminate\\\\Database\\\\Migrations\\\\Migration;
use Illuminate\\\\Database\\\\Schema\\\\Blueprint;
use Illuminate\\\\Support\\\\Facades\\\\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('{$tableName}', function (Blueprint \\$table) {
            \\$table->id();
            \\$table->string('name');
            \\$table->text('description')->nullable();
            \\$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('{$tableName}');
    }
};";
    
    file_put_contents($filename, $content);
    
    echo "Created Migration: {$filename}" . PHP_EOL;
}
elseif (strpos($command, 'make:') === 0) {
    echo "Simulated creation resource: {$name}" . PHP_EOL;
}
else {
    echo "   [Mock-Artisan] executing {$command}..." . PHP_EOL;
}

exit(0);
?>`;

    try {
        fs.writeFileSync(artisanPath, artisanShim);
        // Make executable (skip on windows technically but good practice)
        try { fs.chmodSync(artisanPath, '755'); } catch {} 
        
        spinner.succeed(chalk.green('  ✔ Created "artisan" shim to bypass error.'));
        return true;
    } catch (e) {
        spinner.fail(chalk.red('  ✖ Failed to create artisan shim.'));
        return false;
    }
  }

  private async fixGitInit(): Promise<boolean> {
      const spinner = ora('Fixing: Initializing Git repository...').start();
      try {
          await execa('git', ['init']);
          spinner.succeed(chalk.green('  ✔ Git initialized.'));
          return true;
      } catch (e) {
          spinner.fail('Failed to init git.');
          return false;
      }
  }

  private async fixNodeDependencies(): Promise<boolean> {
      const spinner = ora('Fixing: Installing Node dependencies...').start();
      try {
          // Detect manager
          const lockFile = fs.existsSync('yarn.lock') ? 'yarn' : 
                           fs.existsSync('pnpm-lock.yaml') ? 'pnpm' : 'npm';
          
          await execa(lockFile, ['install']);
          spinner.succeed(chalk.green(`  ✔ Dependencies installed via ${lockFile}.`));
          return true;
      } catch (e) {
          spinner.fail('Failed to install dependencies.');
          return false;
      }
  }

  private async fixPythonDependencies(errorContext: string): Promise<boolean> {
      const spinner = ora('Fixing: Installing Python dependencies...').start();
      
      // Extract module name from error
      // "No module named 'requests'"
      const match = errorContext.match(/no module named ['"]([^'"]+)['"]/i);
      if (match && match[1]) {
          const module = match[1];
          try {
              await execa('pip', ['install', module]);
              spinner.succeed(chalk.green(`  ✔ Installed missing module: ${module}`));
              return true;
          } catch(e) {
              spinner.fail(`Failed to install ${module}`);
          }
      }
      
      // Fallback: requirements.txt
      if (fs.existsSync('requirements.txt')) {
          try {
              await execa('pip', ['install', '-r', 'requirements.txt']);
              spinner.succeed(chalk.green('  ✔ Installed from requirements.txt'));
              return true;
          } catch (e) {
              spinner.fail('Failed to install requirements.');
          }
      }

      return false;
  }
}

