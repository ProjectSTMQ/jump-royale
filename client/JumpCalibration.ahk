; AHK Script to consistently hold down space for a specified amount of time

; Straigh up/down jump
`:: 
    Send, {Space down}
    Sleep, 200
    Send, {Space up}
return

; Jump sideways
':: 
    Send, {a down}{Space down}
    Sleep, 5
    Send, {Space up}
    Send, {a up}
return
