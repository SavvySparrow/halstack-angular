pipeline {
    agent {
        dockerfile {
            args '-u root:root'
            filename 'docker/Dockerfile'
            reuseNode false
        }
    }
    stages {
        stage('Git') {
            steps {
                    withCredentials([usernamePassword(credentialsId:"pdxc-jenkins", passwordVariable:"GIT_PASSWORD", usernameVariable:"GIT_USER")]) {
                        sh "touch ~/.netrc"
                        sh "echo 'machine github.dxc.com' >> ~/.netrc"
                        sh "echo 'login ${GIT_USER}' >> ~/.netrc"
                        sh "echo 'password ${GIT_PASSWORD}' >> ~/.netrc"
                    }
            }
        }
        stage('Release type') {
            when {
                expression { BRANCH_NAME ==~ /^.*\b(release)\b.*$/ } 
            }
            steps {
                script {
                    try {
                        timeout(time: 10, unit: 'MINUTES') {
                            env.RELEASE_OPTION = input message: 'Select a release option', ok: 'Continue',
                                parameters: [
                                    choice(
                                        name: 'type',
                                        choices: "release\nno-release",
                                        description: 'If release is selected, a new release will be released. For the release, the package.json version will be taken so it`s your responsability to change that version. When you select release option, a tag is created in GitHub with that version, the release is pointed to that tag and release notes will be added. Also is important to note that the created package for the release is going to be uploaded to Artifactory. There are only 2 possible prereleases: beta and rc. Any other prerelease is going to be ignored. To continue without releasing, select no-release. After 10 minutes, if you don`t select any choice the default selected option will be `no-release`' 
                                    )
                                ]
                        }
                    } catch(err) {
                        env.RELEASE_OPTION = 'no-release'
                    }
                }
            }
        }
        stage('Password to continue') {
            when {
                expression { env.RELEASE_OPTION == 'release' } 
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId:"diaas-rw", passwordVariable:"ARTIF_PASSWORD", usernameVariable:"ARTIF_USER")]) {
                        env.PASSWORD = input message: 'Enter password to continue', ok: 'Continue',
                            parameters: [string(defaultValue: '', description: 'Password required', name: 'password')]
                        if (env.PASSWORD == ARTIF_PASSWORD) {
                            env.RELEASE_VALID = 'valid';
                        } else {
                            env.RELEASE_VALID = 'invalid';
                            echo 'Invalid password. The version will not be released.'
                        }
                    }
                }
            }
        }
        stage('Install dependencies') {
            steps {
                sh '''
                    npm install
                '''
            }
        }
        stage('Build dxc-ngx-cdk library') {
            steps {
                sh '''
                    ng build dxc-ngx-cdk
                    cp -R ./projects/dxc-ngx-cdk/src/lib/styles ./dist/dxc-ngx-cdk/styles
                '''
            }
        }
        stage('Build dxc-ngx-cdk storybook') {
            steps {
                sh '''
                    npm run build-storybook
                '''
            }
        }
        stage('Test library') {
            steps {
                sh '''
                    echo 'Add the f***ing tests!!'
                '''
            }
        }
        stage('.npmrc') {
            when {
                expression { env.RELEASE_VALID == 'valid' | env.BRANCH_NAME == 'master' } 
            }
            steps {
                withCredentials([file(credentialsId: 'npmrc', variable: 'CONFIG')]) {
                    sh '''
                        cat ${CONFIG} > ~/.npmrc
                        npm config set @diaas:registry https://artifactory.csc.com/artifactory/api/npm/diaas-npm
                    '''
                }
            }
        }
        stage('Publish dxc-ngx-cdk alpha version to Artifactory ') {
            when { branch 'master' }
            steps {
                // Publish library to npm repository
                sh "sed -i -e 's/0.0.0/'0.0.0-alpha.${BUILD_ID}'/g' ./dist/dxc-ngx-cdk/package.json"
                sh '''
                    cd ./dist/dxc-ngx-cdk
                    npm publish --registry https://artifactory.csc.com/artifactory/api/npm/diaas-npm --tag alpha
                '''
            }
        }
        stage('Deploy storybook to dev and publish to Artifactory') {
            when { branch 'master' }
            steps {
                // Deploying storybook to dev-diaas-angular-storybook environment
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'DIAAS-AWS-CLI',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    withAWS(role:"arn:aws:iam::665158502186:role/ISS_DIAAS_PowerUser"){
                        sh '''
                            aws s3 rm s3://dev-diaas-angular-storybook/ --recursive
                            aws s3 cp ./storybook-static/ s3://dev-diaas-angular-storybook/ --recursive
                        '''
                    }
                }
                // Zipping storybook
                sh '''
                    rm -rf storybook.zip
                '''
                zip zipFile: 'storybook.zip', archive: false, dir: './storybook-static'
                // Uploading storybook to Artifactory (diaas-generic)
                withCredentials([usernamePassword(credentialsId:"diaas-rw", passwordVariable:"ARTIF_PASSWORD", usernameVariable:"ARTIF_USER")]) {
                  sh '''
                        curl -u${ARTIF_USER}:${ARTIF_PASSWORD} -T ./storybook.zip "https://artifactory.csc.com/artifactory/diaas-generic/dxc-ngx-cdk/storybook/storybook-bundle.${BRANCH_NAME}.${BUILD_ID}.zip"
                  '''
                }
            }
        }
        stage('Create git tag and relese notes') {
            when {
                expression { env.RELEASE_VALID == 'valid' } 
            }
            steps {
                script {
                    env.RELEASE_NUMBER = sh (
                        script: "grep 'version' package.json | grep -o '[0-9.].*[^\",]'",
                        returnStdout: true
                    ).trim()
                    sh '''
                        gitUrlWithCreds="$(echo "${GIT_URL}" | sed -e 's!://!://'${GIT_USER}:${GIT_PASSWORD}'@!')"
                        git tag "${RELEASE_NUMBER}" "${GIT_COMMIT}"
                        git push "${gitUrlWithCreds}" "${RELEASE_NUMBER}"
                    '''
                }
            }
        }
        stage('Publish dxc-ngx-cdk version to Artifactory ') {
            when {
                expression { env.RELEASE_VALID == 'valid' } 
            }
            steps {
                script {
                    // Publish library to npm repository
                    sh "sed -i -e 's/0.0.0/'${RELEASE_NUMBER}'/g' ./dist/dxc-ngx-cdk/package.json"
                    sh "cat ./dist/dxc-ngx-cdk/package.json"
                    try {
                        env.RELEASE_TYPE = sh (
                            script: "grep 'version' package.json | grep -o '[0-9.].*[^\",]' | grep -o '[a-z].*[^.0-9]'",
                            returnStdout: true
                        ).trim()
                    } catch(err) {
                        env.RELEASE_TYPE = ''
                    }
                    
                    if (env.RELEASE_TYPE == 'beta' | env.RELEASE_TYPE == 'rc') {
                        sh '''
                            cd ./dist/dxc-ngx-cdk
                            npm publish --registry https://artifactory.csc.com/artifactory/api/npm/diaas-npm --tag ${RELEASE_TYPE}
                        '''
                    } else {
                        sh '''
                            cd ./dist/dxc-ngx-cdk
                            npm publish --registry https://artifactory.csc.com/artifactory/api/npm/diaas-npm
                        '''
                    }
                    
                }
            }
        }
        stage('Deploy storybook to demo and publish to Artifactory') {
            when {
                expression { env.RELEASE_VALID == 'valid' } 
            }
            steps {
                // Deploying storybook to dev-diaas-angular-storybook environment
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'DIAAS-AWS-CLI',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    withAWS(role:"arn:aws:iam::665158502186:role/ISS_DIAAS_PowerUser"){
                        sh '''
                            aws s3 rm s3://diaas-angular-storybook/ --recursive
                            aws s3 cp ./storybook-static/ s3://diaas-angular-storybook/ --recursive
                        '''
                    }
                }
                // Zipping storybook
                sh '''
                    rm -rf storybook-static.zip
                '''
                zip zipFile: 'storybook.zip', archive: false, dir: './storybook-static'
                // Uploading storybook to Artifactory (diaas-generic)
                withCredentials([usernamePassword(credentialsId:"diaas-rw", passwordVariable:"ARTIF_PASSWORD", usernameVariable:"ARTIF_USER")]) {
                  sh '''
                        curl -u${ARTIF_USER}:${ARTIF_PASSWORD} -T ./storybook.zip "https://artifactory.csc.com/artifactory/diaas-generic/dxc-ngx-cdk/storybook/storybook-bundle.${BRANCH_NAME}.${BUILD_ID}.zip"
                  '''
                }
            }
        }
    }
    post { 
        failure {
            script {
                sh "echo ${GIT_USER}"
                if (BRANCH_NAME ==~ /^.*\b(release)\b.*$/ | BRANCH_NAME == 'master') {
                    emailext subject: 'The pipeline failed! Please fix this error ASAP :)', body: "Commit: ${GIT_COMMIT}\n Url: ${GIT_URL}\n Branch: ${GIT_BRANCH}", to: 'gvigilrodrig@dxc.com; jsuarezardid@dxc.com',from: 'gvigilrodrig@dxc.com'
                } else {
                    emailext subject: 'The pipeline failed! Your changes are breaking the project, please fix this error ASAP :)', body: "Commit: ${GIT_COMMIT}\n Url: ${GIT_URL}\n Branch: ${GIT_BRANCH}", to: "${GIT_AUTHOR_EMAIL}",from: 'gvigilrodrig@dxc.com'
                }
            }
        }
        success {
            script {
                sh "echo ${GIT_USER}"
                if (BRANCH_NAME ==~ /^.*\b(release)\b.*$/) {
                    emailext subject: 'New DXC Angular CDK Release! Check out the new changes in this version: ${env.RELEASE_NUMBER} :)', body: "Commit: ${GIT_COMMIT}\n Url: ${GIT_URL}\n Branch: ${GIT_BRANCH}", to: 'gvigilrodrig@dxc.com; jsuarezardid@dxc.com',from: 'gvigilrodrig@dxc.com'
                } else {
                    emailext subject: 'Your changes passed succesfully all the stages, you are a really good developer! :)', body: "Commit: ${GIT_COMMIT}\n Url: ${GIT_URL}\n Branch: ${GIT_BRANCH}", to: "${GIT_AUTHOR_EMAIL}",from: 'gvigilrodrig@dxc.com'
                }
            }
        }
    }
}
