# Claude Agent Configuration Guide

**Last Updated:** 2025-10-06
**Recommended For:** Claude Pro Max 5x/20x Plans
**Purpose:** Optimize agent model usage for quota limits and cost efficiency

---

## Recommended Agent Configuration

### Model Assignment Strategy

**OPUS (Strategic - High-Value Tasks Only):**
- `[your-project]-project-manager.md` → `model: opus`
- `security-qa-validator.md` → `model: opus`

**SONNET (Tactical - Implementation Tasks):**
- `[backend]-specialist.md` → `model: sonnet`
- `api-integration-specialist.md` → `model: sonnet`
- `database-architect.md` → `model: sonnet`
- `[frontend]-specialist.md` → `model: sonnet`
- Any other implementation-focused agents → `model: sonnet`

---

## Rationale

### Why This Configuration?

**Claude Plan Limits:**

| Plan | Opus Hours/Week | Sonnet Hours/Week | Prompts per 5hrs |
|------|-----------------|-------------------|------------------|
| **Max 5x** | 15-35 | 140-280 | 50-200 |
| **Max 20x** | 24-40 | 240-480 | 200-800 |

**Opus vs Sonnet:**
- Opus uses **5x more quota** than Sonnet
- Opus is better for strategic/coordination tasks
- Sonnet is excellent for implementation (90% as good, 5x more efficient)

**Impact (Max 5x Example):**
- **Before (all Opus):** ~15-35 full parallel delegations per week
- **After (mixed strategy):** ~75-175 full parallel delegations per week
- **Improvement:** 5x more usage capacity

**Impact (Max 20x Example):**
- **Before (all Opus):** ~24-40 full parallel delegations per week
- **After (mixed strategy):** ~120-200 full parallel delegations per week
- **Improvement:** 5x more usage capacity

---

## When to Use Which Model

### Use OPUS For:
✅ Project coordination and planning (project manager)
✅ Security audits and vulnerability analysis
✅ Complex architectural decisions
✅ Critical code reviews before production
✅ Business logic validation

### Use SONNET For:
✅ Writing controllers, models, services
✅ Creating API endpoints
✅ Building Flutter/React components
✅ Database migrations and schema design
✅ Writing tests
✅ Bug fixes and refactoring
✅ Documentation
✅ Integration work

---

## Quick Update Instructions

### To Apply This Configuration:

**Option 1 - Manual (Per File):**
```bash
# Update each agent file header from:
model: opus

# To:
model: sonnet  # (for implementation specialists)
# OR
model: opus    # (for strategic agents only)
```

**Option 2 - Verify Current Config:**
```bash
grep "model:" .claude/agents/*.md
```

**Expected Output:**
```
.claude/agents/api-integration-specialist.md:model: sonnet
.claude/agents/database-architect.md:model: sonnet
.claude/agents/laravel-backend-specialist.md:model: sonnet
.claude/agents/mojodojo-project-manager.md:model: opus
.claude/agents/react-frontend-specialist.md:model: sonnet
.claude/agents/security-qa-validator.md:model: opus
```

---

## Agent File Locations

All agent configuration files should be in:
```
.claude/agents/
├── [your-project]-project-manager.md    [model: opus]   ← Strategic coordination
├── security-qa-validator.md             [model: opus]   ← Security audits
├── [backend]-specialist.md              [model: sonnet] ← Implementation
├── api-integration-specialist.md        [model: sonnet] ← Implementation
├── database-architect.md                [model: sonnet] ← Implementation
└── [frontend]-specialist.md             [model: sonnet] ← Implementation
```

**Example naming conventions:**
- Laravel project: `laravel-backend-specialist.md`
- Django project: `django-backend-specialist.md`
- React project: `react-frontend-specialist.md`
- Flutter project: `flutter-frontend-specialist.md`
- Node.js project: `nodejs-backend-specialist.md`

---

## Parallel Delegation Pattern (Token Efficient)

### Best Practice Example:

```
User: "Add [new feature] to the application"

Claude (main) → Task([your-project]-project-manager) →

  Project Manager (Opus) issues SINGLE message with parallel Tasks:
    - Task(database-architect, "Design schema changes")                      [Sonnet]
    - Task([backend]-specialist, "Implement backend logic")                  [Sonnet]
    - Task([frontend]-specialist, "Build user interface")                    [Sonnet]
    - Task(security-qa-validator, "Review security implications")            [Opus]

  All work in parallel simultaneously →
  Project Manager aggregates results →
  Returns to Claude (main)

Opus Usage: ~0.5 hours (PM + Security only)
Sonnet Usage: ~1.5 hours (3 implementation specialists)
Total: Well within quota limits
```

### Anti-Pattern (DO NOT DO):
```
❌ Sequential delegation with all Opus:
Project Manager (Opus) → Specialist A (Opus) → wait →
  Specialist B (Opus) → wait → Specialist C (Opus)

Opus Usage: ~4 hours (burns through weekly quota fast!)
Time: 3x slower due to sequential waiting
```

---

## Quota Management Tips

### Monitor Your Usage:
1. Track how many parallel delegations you're running per week
2. Reserve Opus for truly strategic work
3. Use Sonnet for 80% of implementation tasks
4. Batch similar tasks together to minimize agent startup overhead

### Weekly Budget Guidelines:

**Max 5x Plan:**
- **Light week:** 20-30 parallel delegations (safe)
- **Normal week:** 40-60 parallel delegations (comfortable)
- **Heavy week:** 80-100 parallel delegations (approaching limits)
- **Danger zone:** 100+ parallel delegations (may hit Opus cap)

**Max 20x Plan:**
- **Light week:** 40-60 parallel delegations (safe)
- **Normal week:** 80-120 parallel delegations (comfortable)
- **Heavy week:** 150-180 parallel delegations (approaching limits)
- **Danger zone:** 200+ parallel delegations (may hit Opus cap)

### If You Hit Limits:
1. Check which agents are using Opus unnecessarily
2. Switch more agents to Sonnet if appropriate
3. Consider upgrading to Max 20x ($200/mo) for 24-40 hours Opus/week
4. Batch work to spread across multiple weeks

---

## Future Considerations

### When to Add More Opus Agents:
- Never. Keep only 2 agents on Opus (PM + Security).
- If you need more strategic thinking, upgrade to Max 20x plan.

### When to Create New Agents:
If you add new specialist agents (e.g., `flutter-specialist`, `devops-specialist`):
- **Default to Sonnet** unless they do strategic coordination
- Update this document with the new agent configuration
- Follow the hub-and-spoke pattern (all report to Project Manager)

### When to Upgrade Plans:
Consider upgrading to **Max 20x** if:
- Consistently hitting 35-hour Opus limit per week
- Running 100+ parallel delegations per week
- Need faster iteration (200-800 prompts per 5 hours vs 50-200)
- Multiple people using the same account

---

## Quick Reference: Agent Responsibilities

| Agent | Model | Primary Use Case |
|-------|-------|-----------------|
| **[project]-project-manager** | Opus | Coordinate multi-agent workflows, aggregate results, strategic planning |
| **security-qa-validator** | Opus | Security audits, vulnerability analysis, QA reviews, compliance checks |
| **[backend]-specialist** | Sonnet | Backend logic, controllers, services, models, business logic |
| **api-integration-specialist** | Sonnet | API endpoints, testing, third-party integrations, documentation |
| **database-architect** | Sonnet | Schema design, migrations, query optimization, relationships |
| **[frontend]-specialist** | Sonnet | UI components, state management, routing, responsive design |

---

## Changes Log

### 2025-10-06: Initial Configuration Guide Created
- Established Opus (strategic) vs Sonnet (tactical) model strategy
- Documented quota limits for Max 5x and Max 20x plans
- Created parallel delegation best practices
- Provided generic templates for any project type

### Future Updates:
Add new entries here when you make changes to YOUR project's agent configurations.

---

## Instructions for Claude in Future Sessions

When you see this file, you should:

1. ✅ Understand the model assignment strategy
2. ✅ Verify agent configurations match this document
3. ✅ Use parallel delegation patterns described above
4. ✅ Respect the Opus quota limits (15-35 hours/week)
5. ✅ Default new agents to Sonnet unless strategic coordination is required
6. ✅ Update this document if you make configuration changes

**Key Command to Verify:**
```bash
grep "model:" .claude/agents/*.md
```

**Expected Output (example for any project):**
```
[backend]-specialist.md:model: sonnet
api-integration-specialist.md:model: sonnet
database-architect.md:model: sonnet
[project]-project-manager.md:model: opus
[frontend]-specialist.md:model: sonnet
security-qa-validator.md:model: opus
```

**Key Pattern:**
- Most agents should be `sonnet`
- Only project-manager and security-qa-validator should be `opus`

If output doesn't match this pattern, agents may be using too much Opus quota.

---

**End of Configuration Guide**
