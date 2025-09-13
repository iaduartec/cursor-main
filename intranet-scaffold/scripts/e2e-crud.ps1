$base='http://localhost:3000'
$hdr=@{'Content-Type'='application/json'}

Write-Output 'CREATE'
$body=@{slug='test-slug-copilot'; title='Test Project from Copilot'}
$create=Invoke-RestMethod -Method Post -Uri "$base/api/projects" -Headers $hdr -Body ($body | ConvertTo-Json)
$create | ConvertTo-Json

Write-Output 'LIST AFTER CREATE'
(Invoke-RestMethod -Method Get -Uri "$base/api/projects") | ConvertTo-Json

Write-Output 'UPDATE'
$id=$create.id
$updBody=@{slug='test-slug-copilot-upd'; title='Updated Title'}
$upd=Invoke-RestMethod -Method Put -Uri "$base/api/projects/$id" -Headers $hdr -Body ($updBody | ConvertTo-Json)
$upd | ConvertTo-Json

Write-Output 'LIST AFTER UPDATE'
(Invoke-RestMethod -Method Get -Uri "$base/api/projects") | ConvertTo-Json

Write-Output 'DELETE'
(Invoke-RestMethod -Method Delete -Uri "$base/api/projects/$id") | ConvertTo-Json

Write-Output 'LIST AFTER DELETE'
(Invoke-RestMethod -Method Get -Uri "$base/api/projects") | ConvertTo-Json
