<?php

namespace App\Repositories;

use App\Repositories\Interfaces\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

abstract class BaseRepository implements BaseRepositoryInterface
{
    protected Model $model;
    protected Builder $query;

    public function __construct()
    {
        $this->model = $this->getModel();
        $this->resetQuery();
    }

    /**
     * Get the model instance
     */
    abstract protected function getModel(): Model;

    /**
     * Reset the query builder
     */
    protected function resetQuery(): void
    {
        $this->query = $this->model->newQuery();
    }

    /**
     * Find a model by ID
     */
    public function find(int $id): ?Model
    {
        return $this->model->find($id);
    }

    /**
     * Find a model by ID or fail
     */
    public function findOrFail(int $id): Model
    {
        return $this->model->findOrFail($id);
    }

    /**
     * Get all models
     */
    public function all(): Collection
    {
        return $this->model->all();
    }

    /**
     * Create a new model
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * Update a model
     */
    public function update(int $id, array $data): ?Model
    {
        $model = $this->find($id);

        if ($model) {
            $model->update($data);
            return $model->fresh();
        }

        return null;
    }

    /**
     * Delete a model
     */
    public function delete(int $id): bool
    {
        $model = $this->find($id);

        if ($model) {
            return $model->delete();
        }

        return false;
    }

    /**
     * Get paginated results
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        $result = $this->query->paginate($perPage);
        $this->resetQuery();
        return $result;
    }

    /**
     * Find models by criteria
     */
    public function findBy(array $criteria): Collection
    {
        $query = $this->model->newQuery();

        foreach ($criteria as $field => $value) {
            $query->where($field, $value);
        }

        return $query->get();
    }

    /**
     * Find first model by criteria
     */
    public function findOneBy(array $criteria): ?Model
    {
        $query = $this->model->newQuery();

        foreach ($criteria as $field => $value) {
            $query->where($field, $value);
        }

        return $query->first();
    }

    /**
     * Count models by criteria
     */
    public function countBy(array $criteria = []): int
    {
        $query = $this->model->newQuery();

        foreach ($criteria as $field => $value) {
            $query->where($field, $value);
        }

        return $query->count();
    }

    /**
     * Check if model exists by criteria
     */
    public function exists(array $criteria): bool
    {
        return $this->countBy($criteria) > 0;
    }

    /**
     * Get models with relationships
     */
    public function with(array $relations): self
    {
        $this->query->with($relations);
        return $this;
    }

    /**
     * Apply where clause
     */
    public function where(string $column, $operator = null, $value = null): self
    {
        if (func_num_args() === 2) {
            $this->query->where($column, $operator);
        } else {
            $this->query->where($column, $operator, $value);
        }

        return $this;
    }

    /**
     * Apply whereIn clause
     */
    public function whereIn(string $column, array $values): self
    {
        $this->query->whereIn($column, $values);
        return $this;
    }

    /**
     * Apply whereNotIn clause
     */
    public function whereNotIn(string $column, array $values): self
    {
        $this->query->whereNotIn($column, $values);
        return $this;
    }

    /**
     * Apply whereBetween clause
     */
    public function whereBetween(string $column, array $values): self
    {
        $this->query->whereBetween($column, $values);
        return $this;
    }

    /**
     * Apply whereNull clause
     */
    public function whereNull(string $column): self
    {
        $this->query->whereNull($column);
        return $this;
    }

    /**
     * Apply whereNotNull clause
     */
    public function whereNotNull(string $column): self
    {
        $this->query->whereNotNull($column);
        return $this;
    }

    /**
     * Apply orderBy clause
     */
    public function orderBy(string $column, string $direction = 'asc'): self
    {
        $this->query->orderBy($column, $direction);
        return $this;
    }

    /**
     * Apply latest ordering
     */
    public function latest(string $column = 'created_at'): self
    {
        $this->query->latest($column);
        return $this;
    }

    /**
     * Apply oldest ordering
     */
    public function oldest(string $column = 'created_at'): self
    {
        $this->query->oldest($column);
        return $this;
    }

    /**
     * Apply limit
     */
    public function limit(int $limit): self
    {
        $this->query->limit($limit);
        return $this;
    }

    /**
     * Apply offset
     */
    public function offset(int $offset): self
    {
        $this->query->offset($offset);
        return $this;
    }

    /**
     * Get the results
     */
    public function get(): Collection
    {
        $result = $this->query->get();
        $this->resetQuery();
        return $result;
    }

    /**
     * Get first result
     */
    public function first(): ?Model
    {
        $result = $this->query->first();
        $this->resetQuery();
        return $result;
    }

    /**
     * Apply search functionality
     */
    public function search(string $term, array $fields): self
    {
        $this->query->where(function ($query) use ($term, $fields) {
            foreach ($fields as $field) {
                $query->orWhere($field, 'like', "%{$term}%");
            }
        });

        return $this;
    }

    /**
     * Apply date range filter
     */
    public function dateRange(string $column, $startDate, $endDate): self
    {
        $this->query->whereBetween($column, [$startDate, $endDate]);
        return $this;
    }

    /**
     * Apply active scope (if model has is_active column)
     */
    public function active(): self
    {
        $this->query->where('is_active', true);
        return $this;
    }

    /**
     * Apply published scope (if model has status column)
     */
    public function published(): self
    {
        $this->query->where('status', 'published');
        return $this;
    }

    /**
     * Get random records
     */
    public function random(int $count = 1): Collection
    {
        return $this->model->inRandomOrder()->limit($count)->get();
    }

    /**
     * Bulk insert
     */
    public function bulkInsert(array $data): bool
    {
        return $this->model->insert($data);
    }

    /**
     * Bulk update
     */
    public function bulkUpdate(array $criteria, array $data): int
    {
        $query = $this->model->newQuery();

        foreach ($criteria as $field => $value) {
            $query->where($field, $value);
        }

        return $query->update($data);
    }
}