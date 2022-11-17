# SSD_Backend

# routes

# auth -

http://localhost:5000/api/auth/register
http://localhost:5000/api/auth/login

{
"email":"rd404@gmail.com",
"password":"rd123456",
}

# file -

http://localhost:5000/api/file/saveFile
http://localhost:5000/api/file/getAllfiles
http://localhost:5000/api/file/getFileById/id
http://localhost:5000/api/file/deleteFileById/id

{
"file": "file",
"allowedRoles":["ADMIN","MANAGER"]
}

# message -

http://localhost:5000/api/file/saveFile
http://localhost:5000/api/file/getAllMessages
http://localhost:5000/api/file/getMessageById/id
http://localhost:5000/api/file/deleteMessageById/id

{
"content": "content",
"allowedRoles":["ADMIN","MANAGER"]
}
