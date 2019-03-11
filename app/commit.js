var shell = require('shelljs');
var fs = require('fs');


var abc = shell.exec("git rev-parse --abbrev-ref HEAD");
console.log('current branch: ',abc.stdout)

setUpstream();
commitSteps("oss","upstream-public");
commitSteps("internal","upstream-delta");

function setUpstream(){
    let url_delta = `https://bitbucket.corporate.t-mobile.com/scm/cap/jazz_webapp_delta.git`;
    let git_url_oss = `https://github.com/tmobile/jazz.git`;    
    
    shell.exec(`git remote add upstream-public ${git_url_oss}`);
    shell.exec(`git remote add upstream-detla ${url_delta}`);
    shell.exec(`git remote -v`);	
}

function commitSteps(target,upstream,branch){
    if(target === "internal"){
        fs.rename('.gitignore-internal', '.gitignore', function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
    }
    else if( target === "oss"){
        fs.rename('.gitignore-public', '.gitignore', function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
    }
    shell.exec(`git checkout ${branch}`);
    shell.exec(`git add .gitignore`);
    shell.exec(`git commit -m commit-gitignore`);
    shell.exec(`git rm -r —cached .`);
    shell.exec(`git add .`);
    shell.exec(`git commit -m commit-all-${target}-changes`);
    shell.exec(`git push ${upstream} ${branch}`);
}

