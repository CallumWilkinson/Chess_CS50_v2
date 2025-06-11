<# ---------- SETTINGS ---------- #>

# Folders that hold regular source files
$sourceFolders = @(
    '.\backend',
    '.\public'
)

# Folder that holds Jest tests
$testFolder = '.\tests'

# Regex pattern for test-file names
$testPattern = '\.(test|spec)\.js$'

# Regex pattern that matches any node_modules segment in a path
$nodeModulesPattern = '\\node_modules\\'

<# ---------- HELPER ---------- #>

function Get-Lines {
    param (
        [string[]] $Paths,
        [bool]     $IncludeTests
    )

    $files = @()
    foreach ($path in $Paths) {
        if (Test-Path $path) {
            $files += Get-ChildItem -Path $path -Recurse -Include *.js -File -ErrorAction SilentlyContinue
        }
    }
    $files = $files | Where-Object {
        $_.FullName -notmatch $nodeModulesPattern -and
        ($IncludeTests ? ($_.Name -match $testPattern) : ($_.Name -notmatch $testPattern))
    }

    if ($files.Count -eq 0) { return 0 }

    return (Get-Content $files.FullName | Measure-Object -Line).Lines
}

<# ---------- MAIN ---------- #>

$jsLines   = Get-Lines -Paths $sourceFolders -IncludeTests:$false
$testLines = Get-Lines -Paths @($testFolder) -IncludeTests:$true

Write-Host "JavaScript Source Lines (backend + public, no node_modules): $jsLines"
Write-Host "Jest Test Lines (tests, no node_modules):           $testLines"