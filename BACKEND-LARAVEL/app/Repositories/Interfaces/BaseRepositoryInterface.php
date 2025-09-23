<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BaseRepositoryInterface
{
    /**
     * Find a model by ID
     */
    public function find(int $id): ?Model;

    /**
     * Find a model by ID or fail
     */
    public function findOrFail(int $id): Model;

    /**
     * Get all models
     */
    public function all(): Collection;

    /**
     * Create a new model
     */
    public function create(array $data): Model;

    /**
     * Update a model
     */
    public function update(int $id, array $data): ?Model;

    /**
     * Delete a model
     */
    public function delete(int $id): bool;

    /**
     * Get paginated results
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    /**
     * Find models by criteria
     */
    public function findBy(array $criteria): Collection;

    /**
     * Find first model by criteria
     */
    public function findOneBy(array $criteria): ?Model;

    /**
     * Count models by criteria
     */
    public function countBy(array $criteria = []): int;

    /**
     * Check if model exists by criteria
     */
    public function exists(array $criteria): bool;

    /**
     * Get models with relationships
     */
    public function with(array $relations): self;

    /**
     * Apply where clause
     */
    public function where(string $column, $operator = null, $value = null): self;

    /**
     * Apply orderBy clause
     */
    public function orderBy(string $column, string $direction = 'asc'): self;

    /**
     * Apply limit
     */
    public function limit(int $limit): self;

    /**
     * Get the results
     */
    public function get(): Collection;

    /**
     * Get first result
     */
    public function first(): ?Model;
}