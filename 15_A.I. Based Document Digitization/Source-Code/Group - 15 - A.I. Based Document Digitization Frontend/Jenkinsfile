pipeline{
    agent any
    tools {nodejs "nodejs"}

    stages{
        stage('install dependencies'){  
            steps{
                sh 'npm i -g'
            } 
        }
        stage('build app'){
            steps{
            sh 'npm run build'               
            }           
        }
         stage('delete prev'){
            steps{
                sh 'ssh root@domain.com rm -r ../../var/www/html/domain.com/*'               
            }     
         } 
        stage('move build folder'){
            steps{
                sh 'rsync -pav ./build/* root@domain.com:../../var/www/html/domain.com'              
            }           
        } 
    }
}
