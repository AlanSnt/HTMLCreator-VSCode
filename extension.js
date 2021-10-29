const vscode = require("vscode");
const fs = require("fs");

let options = {
    "title": "",
    "type": 0,
    "cssFrameworks": [],
    "jsFrameworks": []
};

const clearOptions = {
    "title": "",
    "type": 0,
    "cssFrameworks": [],
    "jsFrameworks": []
};

const htmlData = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Title</title>
    <!-- CSS -->
</head>
<body>
	
</body>
<!-- JS -->
</html>
`;

const cssData = `* {
	margin: 0px;
	padding: 0px;
	box-sizing: border-box;
}`;

// Function to create folders
async function CreateFolder(f, callback) {
    const path = f+"/sources/";

    fs.mkdir(path+"js", {recursive: true}, function(err) {
        if (err) console.log(err);
    })

    fs.mkdir(path+"css", {recursive: true}, function(err) {
        if (err) console.log(err);
    })

    fs.mkdir(path+"image", {recursive: true}, function(err) {
        if (err) console.log(err);
    })

    CreateFiles(f, callback);
}

// Function to create files
async function CreateFiles(path, callback){
    let cssCode = ` `;
    let jsCode = ``;

    fs.appendFile(path+'/index.html', htmlData, function (err) {
        if (err) {
            console.log(err);
            vscode.window.showErrorMessage("Error create HTML file: "+err);
            return;
        } else {
            if(options['jsFrameworks'] != null){
                options['jsFrameworks'].forEach(element => {
                    if (element == "Jquery"){
                        jsCode = jsCode + `
<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>`;
                    }
        
                    if (element == "AOS"){
                        cssCode = cssCode + `
    <link href="https://cdn.rawgit.com/michalsnik/aos/2.1.1/dist/aos.css" rel="stylesheet">`;
                        jsCode = jsCode + `
<script src="https://cdn.rawgit.com/michalsnik/aos/2.1.1/dist/aos.js"></script>`;
                    }
                });
            }
        
            if(options['cssFrameworks'] != null){
                options['cssFrameworks'].forEach(element => {
                    if (element == "Bootstrap"){
                        cssCode = cssCode + `
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">`;
                        jsCode = jsCode + `
<script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" crossorigin="anonymous"></script>` ;
                    }
                });
            }

            switch (parseInt(options['type'])) {
                case 2:
                    cssCode = cssCode + `
    <link rel="stylesheet" href="./sources/css/style.css">`;

                    fs.appendFile(path+'/sources/css/style.css', cssData, function (err) {
                        if (err) {
                            console.log(err);
                            vscode.window.showErrorMessage("Error create CSS file: "+err);
                            return;
                        }else{
                            EditFiles(path, callback, cssCode, jsCode);
                        }
                    });
                    break;
                case 3:
                    jsCode = jsCode + `
<script src="./sources/js/main.js"></script>` ;

                    fs.appendFile(path+'/sources/js/main.js', '', function (err) {
                        if (err) {
                            console.log(err);
                            vscode.window.showErrorMessage("Error create JS file: "+err);
                            return;
                        }else{
                            EditFiles(path, callback, cssCode, jsCode);
                        }
                    });
                    break;
                case 4:
                    cssCode = cssCode + `
    <link rel="stylesheet" href="./sources/css/style.css">`;
                                    jsCode = jsCode + `
<script src="./sources/js/main.js"></script>` ;

                    fs.appendFile(path+'/sources/js/main.js', '', function (err) {
                        if (err) {
                            console.log(err);
                            vscode.window.showErrorMessage("Error create JS file: "+err);
                            return;
                        }else{
                            fs.appendFile(path+'/sources/css/style.css', cssData, function (err) {
                                if (err) {
                                    console.log(err);
                                    vscode.window.showErrorMessage("Error create CSS file: "+err);
                                    return;
                                }else{
                                    EditFiles(path, callback, cssCode, jsCode);
                                }
                            });
                        }
                    });
                    break;
                default:
                    EditFiles(path, callback, cssCode, jsCode);
                    break;
            }
        }
    });
}

async function EditFiles(path, callback, cssCode, jsCode) {
    let data = fs.readFileSync(path+'/index.html').toString().split("\n");

    data.splice(8, 0, cssCode);
    data.join("\n");
    data.splice(14, 0, jsCode);
    
    let newData = data.join("\n");

    fs.writeFile(path+'/index.html', newData.replace('Title', options['title']), function (err) {
        if (err) return console.log(err);
    });

    if (typeof callback == "function")
        callback();
}

async function UserInput() {
    // Ask if the user wants a CSS Framework
    const cssFramework = await vscode.window.showInputBox({
        title: "You want to install a CSS frameworks ?",
        placeHolder: "y/N"
    })

    // List of installable CSS Frameworks
    if(cssFramework.toLowerCase() == "y"){
        const bootstrap = await vscode.window.showInputBox({
            title: "You want to install Bootstap ?",
            placeHolder: "y/N"
        })

        if(bootstrap.toLowerCase() == "y"){
            options['cssFrameworks'].push("Bootstrap");
        }
    }

    // Ask if the user wants a JS Framework
    const jsFramework = await vscode.window.showInputBox({
        title: "You want to install a JS frameworks ?",
        placeHolder: "y/N"
    })

    // List of installable JS Frameworks
    if(jsFramework.toLowerCase() == "y"){
        const jquery = await vscode.window.showInputBox({
            title: "You want to install Jquery ?",
            placeHolder: "y/N"
        })

        const aos = await vscode.window.showInputBox({
            title: "You want to install AOS ?",
            placeHolder: "y/N"
        })

        if(jquery.toLowerCase() == "y"){
            options['jsFrameworks'].push("Jquery");
        }

        if(aos.toLowerCase() == "y"){
            options['jsFrameworks'].push("AOS");
        }
    }

    // Current path of open folder
    let f = vscode.workspace.workspaceFolders[0].uri.fsPath ; 

    // Start to create folder and create files
    CreateFolder(f, () => {
        vscode.window.showInformationMessage("Folders and files have been created");
    });
}

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "htmlcreator.html",
    function() {
        // Clean Object
        options = clearOptions;
        // Check if VSCode is in workspace or not
        if(vscode.workspace.workspaceFolders !== undefined) {

            // First Input
            vscode.window.showInputBox({prompt: 'Name of the project ?', placeHolder: "MySuperWebSite"}).then(title => {
                if (title === undefined) {
                    return;
                }else{
                    options['title'] = title;

                    vscode.window.showInputBox({prompt: 'Select your option', placeHolder: "1 : html only | 2 : html+css | 3: html+js | 4: html+css+js"}).then(value => {
                        if (value === undefined) {
                            return;
                        }
        
                        if (value == 1 || value == 2 || value == 3 || value == 4) {
                            // Save First Input into object
                            options['type'] = value;
                            UserInput();
                        } else {
                            vscode.window.showErrorMessage("Please select one -> 1 : html only | 2 : html+css | 3: html+js | 4: html+css+js");
                            return;
                        }
                    });
                }
            });
        } else {
            vscode.window.showErrorMessage("Working folder not found, open a folder and try again");
        }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;