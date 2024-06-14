pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'xnanoengine/test_info290_rollback'
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
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        dockerImage.push("${DEPLOY_VERSION}")
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
                        
                        // Delay to allow containers to start
                        sleep(time: 30, unit: 'SECONDS')

                        // Verify the deployment
                        def result = bat(script: 'docker ps --filter "name=backend" --filter "status=running" -q', returnStatus: true)
                        if (result == 0) {
                            echo 'Se encontraron contenedores con el nombre "backend" en estado "running".'
                        } else {
                            echo 'No se encontraron contenedores con el nombre "backend" en estado "running".'
                            error "El contenedor 'backend' no está en estado 'running'."
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
                echo "Limpieza y finalización de la ejecución del pipeline."
                // Clean up if necessary
            }
        }
    }
}

def rollback() {
    echo "Iniciando rollback..."

    try {
        // Execute rollback using docker-compose.rollback.yml
        bat "docker-compose -f docker-compose.rollback.yml up -d --remove-orphans"
        
        echo "Rollback completado."
    } catch (Exception rollbackException) {
        echo "Error durante el rollback: ${rollbackException.message}"
        error "Error durante el rollback."
    }
}
