pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'test_info290_rollback'
        DEPLOY_VERSION = 'latest'
        ROLLBACK_VERSION = 'v1'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image with the specified version
                    dockerImage = docker.build("${DOCKER_IMAGE}:${DEPLOY_VERSION}", "./backend")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Push the image with the latest tag
                    docker.withRegistry('', 'dockerhub-credentials') {
                        dockerImage.push()
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    try {
                        // Deploy using docker-compose.yml
                        bat "docker-compose -f docker-compose.yml up -d"
                        
                        // Verify the deployment
                        def result = bat(script: "docker ps --filter 'name=backend' --filter 'status=running' -q", returnStatus: true)
                        
                        if (result != 0) {
                            error "Error: No se pudo iniciar el servicio con la nueva versión."
                        }
                    } catch (Exception e) {
                        echo "Error durante el despliegue: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        // Execute rollback
                        rollback()
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Clean up if necessary
            }
        }
    }
}

def rollback() {
    echo "Iniciando rollback..."

    try {
        // Execute rollback using docker-compose.rollback.yml
        bat "docker-compose -f docker-compose.rollback.yml up -d"
        
        echo "Rollback completado."
    } catch (Exception rollbackException) {
        echo "Error durante el rollback: ${rollbackException.message}"
        error "Error durante el rollback."
    }
}
