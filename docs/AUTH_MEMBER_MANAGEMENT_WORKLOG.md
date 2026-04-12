# Auth And Member Management Worklog

## What Changed

### Auth
- Fixed the login request payload to use `rememberMe`, which matches [`api/routes/api.php`](/home/judah/Documents/tenet/congregation/api/routes/api.php) and the backend `LoginRequest`.
- Improved auth error handling so Laravel response messages are surfaced instead of generic HTTP failures.
- Hardened protected-route behavior to clear broken sessions, store the intended destination, and redirect unauthenticated users back through `/login`.
- Updated login success behavior to return users to their originally requested route after authentication.
- Protected the members page with [`ProtectedRoute`](/home/judah/Documents/tenet/congregation/web/components/auth/protected-route.tsx) so member management no longer renders outside an authenticated session.

### Member Management
- Replaced the mock member list in [`use-members.ts`](/home/judah/Documents/tenet/congregation/web/hooks/use-members.ts) with live API calls.
- Added a typed member normalization layer in [`members.ts`](/home/judah/Documents/tenet/congregation/web/utils/members.ts) to map backend snake_case payloads to the existing React UI shape.
- Reworked the API client in [`api-client.ts`](/home/judah/Documents/tenet/congregation/web/utils/api-client.ts) to support the live member endpoints and Laravel response envelopes.
- Rebuilt the member modal in [`member-modal.tsx`](/home/judah/Documents/tenet/congregation/web/components/members/member-modal.tsx) so create and edit now submit to `/api/member/save` and `/api/member/{id}`.
- Updated the member directory screen in [`members-management.tsx`](/home/judah/Documents/tenet/congregation/web/components/members/members-management.tsx) to use live stats, live search, refresh, and API-backed save flows.
- Adjusted table and details rendering to work with the normalized member model and to avoid pretending contribution data exists when the current API does not expose it.

### Backend Alignment
- Exposed `GET /api/member` in [`api/routes/api.php`](/home/judah/Documents/tenet/congregation/api/routes/api.php) to match the already-implemented `MemberController::index()` and make the directory usable.

## Validation

- `pnpm type-check` still fails at the project level, but the remaining errors are pre-existing and outside auth/member management.
- Current blockers are mostly unrelated UI dependencies (`next-themes`, `react-day-picker`, `recharts`, `vaul`, `react-hook-form`, `sonner`, `embla-carousel-react`, `react-resizable-panels`) and existing `never[]` typing issues in other feature hooks.
- The focused auth/member files changed in this pass did not appear in the TypeScript error output.

## Ways Forward

1. Add server-backed family lookup and link/unlink actions in the member modal using `/api/families/{family}/members` so `family_id` becomes a real selection flow instead of a free-text field.
2. Introduce session validation on app boot with a lightweight authenticated request, so expired Sanctum tokens can be detected before the user reaches a broken state.
3. Add optimistic toasts and field-level validation messaging for member create/update responses to improve operator feedback.
4. Expose contribution/tithe endpoints for members, then re-enable the contributions tab with real data instead of the current placeholder.
5. Clean up the broader web app TypeScript baseline so `pnpm type-check` becomes a reliable regression gate for future work.
