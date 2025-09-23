<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductionDataSeeder extends Seeder
{
    /**
     * Run the database seeds - Import production DAZL data
     */
    public function run(): void
    {
        $this->command->info('Importing production DAZL database...');

        // Path to the production SQL dump
        $sqlFile = base_path('../ARCHIVES/Dazl-Pro-App/dazl_production_export.sql');

        if (!file_exists($sqlFile)) {
            $this->command->error('Production SQL file not found at: ' . $sqlFile);
            return;
        }

        // Read and execute the SQL file
        $sql = file_get_contents($sqlFile);

        // Split by semicolon and execute each statement
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            fn($stmt) => !empty($stmt) && !str_starts_with($stmt, '--')
        );

        $this->command->info('Executing ' . count($statements) . ' SQL statements...');

        DB::beginTransaction();

        try {
            foreach ($statements as $statement) {
                if (!empty(trim($statement))) {
                    DB::unprepared($statement);
                }
            }

            DB::commit();
            $this->command->info('✅ Production data imported successfully!');

            // Show some stats
            $this->showImportStats();

        } catch (\Exception $e) {
            DB::rollback();
            $this->command->error('❌ Import failed: ' . $e->getMessage());
        }
    }

    private function showImportStats()
    {
        try {
            $realtors = DB::table('realtors')->count();
            $professionals = DB::table('professionals')->count();
            $customers = DB::table('customers')->count();
            $reports = DB::table('home_diagnostic_reports')->count();
            $projects = DB::table('projects')->count();

            $this->command->info("📊 Imported Data:");
            $this->command->info("   • Realtors: {$realtors}");
            $this->command->info("   • Professionals: {$professionals}");
            $this->command->info("   • Customers: {$customers}");
            $this->command->info("   • PHD Reports: {$reports}");
            $this->command->info("   • Projects: {$projects}");

        } catch (\Exception $e) {
            $this->command->info('Data imported - stats unavailable');
        }
    }
}
