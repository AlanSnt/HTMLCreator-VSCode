const vscode = require("vscode");
const fs = require("fs");

const htmlData = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	
</body>
</html>
`;

const htmlJSData = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	
</body>
<script src="./sources/js/main.js"></script>
</html>
`;

const htmlCSSData = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>

	<link rel="stylesheet" href="./sources/css/style.css">
</head>
<body>
	
</body>
</html>
`;

const htmlJSCSSData = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>

	<link rel="stylesheet" href="./sources/css/style.css">
</head>
<body>
	
</body>
<script src="./sources/js/main.js"></script>
</html>
`;

const cssData = `* {
	margin: 0px;
	padding: 0px;
	box-sizing: border-box;
}`;

async function CreateFolder(f, callback) {
    fs.mkdir(f+"/sources/js", {recursive: true}, function(err) {
        if (err) {
          console.log(err)
        }else{
            number++;
        }
    })

    fs.mkdir(f+"/sources/css", {recursive: true}, function(err) {
        if (err) {
          console.log(err)
        }else{
            number++;
        }
    })

    
    fs.mkdir(f+"/sources/image", {recursive: true}, function(err) {
        if (err) {
          console.log(err)
        }else{
            number++;
        }
    })

    if (typeof callback == "function")
        callback();
}


async function CreateGist() {
    if(vscode.workspace.workspaceFolders !== undefined) {
        const option = await vscode.window.showInputBox({
            title: "Select your option",
            placeHolder: "1 : html only | 2 : html+css | 3: html+js | 4: html+css+js"
        });

        if(option == 1 || option == 2 || option == 3 || option == 4) {
            let f = vscode.workspace.workspaceFolders[0].uri.fsPath ; 

            CreateFolder(f, () => {
                switch (parseInt(option)) {
                    case 1:
                        console.log("1");
                        console.log(f);
                        fs.appendFile(f+'/index.html', htmlData, function (err) {
                            if (err) throw err;
                        });
                        break;
                    case 2:
                        fs.appendFile(f+'/index.html', htmlCSSData, function (err) {
                            if (err) throw err;
                            else{
                                fs.appendFile(f+'/sources/css/style.css', cssData, function (err) {
                                    if (err) throw err;
                                });
                            }
                        });
                        break;
            
                    case 3:
                        fs.appendFile(f+'/index.html', htmlJSData, function (err) {
                            if (err) throw err;
                            else{
                                fs.appendFile(f+'/sources/js/main.js', '', function (err) {
                                    if (err) throw err;
                                });
                            }
                        });
                        break;
                    case 4:
                        fs.appendFile(f+'/index.html', htmlJSCSSData, function (err) {
                            if (err) throw err;
                            else{
                                fs.appendFile(f+'/sources/js/main.js', '', function (err) {
                                    if (err) throw err;
                                    else{
                                        fs.appendFile(f+'/sources/css/style.css', cssData, function (err) {
                                            if (err) throw err;
                                        });
                                    }
                                });
                            }
                        });
                        break;
                }

                vscode.window.showInformationMessage("Folders and files have been created");
            });

        }else{
            vscode.window.showErrorMessage("Please select one options");
        }  
    } else {
        vscode.window.showErrorMessage("Working folder not found, open a folder and try again");
    }
}

function activate(context) {
  // this code runs whenever your click 'Create Gist' from the context menu in your browser.
  let disposable = vscode.commands.registerCommand(
    "htmlcreator.html",
    function() {
      CreateGist();
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;