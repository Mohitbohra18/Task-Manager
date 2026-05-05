# ============================================
# Phase 2 — Backend API Test Script
# ============================================

Write-Host "`n=== PHASE 2: BACKEND API TESTING ===" -ForegroundColor Cyan

$BASE = "http://localhost:5000/api"

function Api {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [string]$Token = $null,
        [string]$Label
    )
    Write-Host "`n--- $Label ---" -ForegroundColor Yellow
    $headers = @{ "Content-Type" = "application/json" }
    if ($Token) { $headers["Authorization"] = "Bearer $Token" }

    try {
        if ($Body) {
            $resp = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -Body $Body
        } else {
            $resp = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers
        }
        $resp | ConvertTo-Json -Depth 5
        return $resp
    } catch {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $errBody = $reader.ReadToEnd()
        Write-Host "ERROR: $errBody" -ForegroundColor Red
        return $null
    }
}

# ============= AUTH TESTS =============
Write-Host "`n`n========== AUTH TESTS ==========" -ForegroundColor Green

# Test: Login Admin
$adminLogin = Api -Method POST -Url "$BASE/auth/login" -Body '{"email":"admin@test.com","password":"admin123"}' -Label "Login Admin"
$ADMIN_TOKEN = $adminLogin.data.token
$ADMIN_ID = $adminLogin.data.user.id
Write-Host "Admin Token: $($ADMIN_TOKEN.Substring(0,20))..." -ForegroundColor Gray

# Test: Login Member
$memberLogin = Api -Method POST -Url "$BASE/auth/login" -Body '{"email":"member@test.com","password":"member123"}' -Label "Login Member"
$MEMBER_TOKEN = $memberLogin.data.token
$MEMBER_ID = $memberLogin.data.user.id
Write-Host "Member Token: $($MEMBER_TOKEN.Substring(0,20))..." -ForegroundColor Gray

# Test: Get Me (Admin)
Api -Method GET -Url "$BASE/auth/me" -Token $ADMIN_TOKEN -Label "Get Me (Admin)"

# Test: Get Me (Member)
Api -Method GET -Url "$BASE/auth/me" -Token $MEMBER_TOKEN -Label "Get Me (Member)"

# Test: Invalid Login
Api -Method POST -Url "$BASE/auth/login" -Body '{"email":"admin@test.com","password":"wrong"}' -Label "Invalid Login (should fail)"

# Test: Signup Validation
Api -Method POST -Url "$BASE/auth/signup" -Body '{"email":"bad","password":"12"}' -Label "Signup Validation (should fail)"

# Test: No Token
Api -Method GET -Url "$BASE/auth/me" -Label "No Token Access (should fail)"

# Test: Get All Users (Admin)
Api -Method GET -Url "$BASE/auth/users" -Token $ADMIN_TOKEN -Label "Get All Users (Admin)"

# Test: Get All Users (Member - should fail)
Api -Method GET -Url "$BASE/auth/users" -Token $MEMBER_TOKEN -Label "Get All Users (Member - should fail)"


# ============= PROJECT TESTS =============
Write-Host "`n`n========== PROJECT TESTS ==========" -ForegroundColor Green

# Admin creates project
$projResp = Api -Method POST -Url "$BASE/projects" -Token $ADMIN_TOKEN -Body '{"name":"Test Project","description":"A test project","priority":"high"}' -Label "Create Project (Admin)"
$PROJECT_ID = $projResp.data.project._id
Write-Host "Project ID: $PROJECT_ID" -ForegroundColor Gray

# Member tries to create project (should fail)
Api -Method POST -Url "$BASE/projects" -Token $MEMBER_TOKEN -Body '{"name":"Member Project","description":"Should fail"}' -Label "Create Project (Member - should fail)"

# Get all projects (Admin)
Api -Method GET -Url "$BASE/projects" -Token $ADMIN_TOKEN -Label "Get Projects (Admin)"

# Get single project
Api -Method GET -Url "$BASE/projects/$PROJECT_ID" -Token $ADMIN_TOKEN -Label "Get Project by ID"

# Update project
Api -Method PUT -Url "$BASE/projects/$PROJECT_ID" -Token $ADMIN_TOKEN -Body '{"status":"active","name":"Updated Project"}' -Label "Update Project (Admin)"

# Add member to project
Api -Method POST -Url "$BASE/projects/$PROJECT_ID/members" -Token $ADMIN_TOKEN -Body "{`"userId`":`"$MEMBER_ID`"}" -Label "Add Member to Project"

# Member can now see the project
Api -Method GET -Url "$BASE/projects/$PROJECT_ID" -Token $MEMBER_TOKEN -Label "Member Access Project (after added)"


# ============= TASK TESTS =============
Write-Host "`n`n========== TASK TESTS ==========" -ForegroundColor Green

# Admin creates task
$taskResp = Api -Method POST -Url "$BASE/tasks" -Token $ADMIN_TOKEN -Body "{`"title`":`"Design Database Schema`",`"description`":`"Create ERD`",`"priority`":`"high`",`"project`":`"$PROJECT_ID`",`"assignee`":`"$MEMBER_ID`",`"dueDate`":`"2026-06-01`"}" -Label "Create Task (Admin)"
$TASK_ID = $taskResp.data.task._id
Write-Host "Task ID: $TASK_ID" -ForegroundColor Gray

# Create second task
Api -Method POST -Url "$BASE/tasks" -Token $ADMIN_TOKEN -Body "{`"title`":`"Setup CI/CD`",`"priority`":`"medium`",`"project`":`"$PROJECT_ID`"}" -Label "Create Task 2 (Admin)"

# Get all tasks
Api -Method GET -Url "$BASE/tasks" -Token $ADMIN_TOKEN -Label "Get All Tasks (Admin)"

# Get task by ID
Api -Method GET -Url "$BASE/tasks/$TASK_ID" -Token $ADMIN_TOKEN -Label "Get Task by ID"

# Get my tasks (Member)
Api -Method GET -Url "$BASE/tasks/my-tasks" -Token $MEMBER_TOKEN -Label "Get My Tasks (Member)"

# Get tasks by project
Api -Method GET -Url "$BASE/tasks/project/$PROJECT_ID" -Token $ADMIN_TOKEN -Label "Get Tasks by Project"

# Member updates task status
Api -Method PUT -Url "$BASE/tasks/$TASK_ID" -Token $MEMBER_TOKEN -Body '{"status":"in-progress"}' -Label "Member Updates Task Status"

# Admin updates task fully
Api -Method PUT -Url "$BASE/tasks/$TASK_ID" -Token $ADMIN_TOKEN -Body '{"priority":"critical","status":"in-review"}' -Label "Admin Updates Task"


# ============= TEAM TESTS =============
Write-Host "`n`n========== TEAM TESTS ==========" -ForegroundColor Green

# Admin creates team
$teamResp = Api -Method POST -Url "$BASE/teams" -Token $ADMIN_TOKEN -Body '{"name":"Engineering Team","description":"Core engineering team"}' -Label "Create Team (Admin)"
$TEAM_ID = $teamResp.data.team._id
Write-Host "Team ID: $TEAM_ID" -ForegroundColor Gray

# Member tries to create team (should fail)
Api -Method POST -Url "$BASE/teams" -Token $MEMBER_TOKEN -Body '{"name":"Rogue Team"}' -Label "Create Team (Member - should fail)"

# Add member to team
Api -Method POST -Url "$BASE/teams/$TEAM_ID/members" -Token $ADMIN_TOKEN -Body "{`"userId`":`"$MEMBER_ID`",`"role`":`"member`"}" -Label "Add Member to Team"

# Get all teams
Api -Method GET -Url "$BASE/teams" -Token $ADMIN_TOKEN -Label "Get Teams (Admin)"

# Get team by ID
Api -Method GET -Url "$BASE/teams/$TEAM_ID" -Token $ADMIN_TOKEN -Label "Get Team by ID"

# Update team
Api -Method PUT -Url "$BASE/teams/$TEAM_ID" -Token $ADMIN_TOKEN -Body '{"name":"Updated Engineering Team"}' -Label "Update Team"


# ============= DASHBOARD TESTS =============
Write-Host "`n`n========== DASHBOARD TESTS ==========" -ForegroundColor Green

Api -Method GET -Url "$BASE/dashboard" -Token $ADMIN_TOKEN -Label "Dashboard (Admin)"
Api -Method GET -Url "$BASE/dashboard" -Token $MEMBER_TOKEN -Label "Dashboard (Member)"


# ============= DELETE TESTS =============
Write-Host "`n`n========== DELETE TESTS ==========" -ForegroundColor Green

# Member tries to delete task (should fail - not creator)
Api -Method DELETE -Url "$BASE/tasks/$TASK_ID" -Token $MEMBER_TOKEN -Label "Delete Task (Member - should fail)"

# Admin deletes task
Api -Method DELETE -Url "$BASE/tasks/$TASK_ID" -Token $ADMIN_TOKEN -Label "Delete Task (Admin)"

# Member tries to delete project (should fail)
Api -Method DELETE -Url "$BASE/projects/$PROJECT_ID" -Token $MEMBER_TOKEN -Label "Delete Project (Member - should fail)"

# Admin deletes project
Api -Method DELETE -Url "$BASE/projects/$PROJECT_ID" -Token $ADMIN_TOKEN -Label "Delete Project (Admin)"


Write-Host "`n`n=== ALL TESTS COMPLETE ===" -ForegroundColor Cyan
