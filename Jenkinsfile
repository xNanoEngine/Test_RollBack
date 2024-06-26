pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'xnanoengine/test_info290_rollback'
        DEPLOY_VERSION = 'latest'
        ROLLBACK_VERSION = 'v1'
        PORT = 3000

    }

    stages {
        stage('Clean Environment') {
            steps {
                script {
                    // Limpiar contenedores que puedan estar corriendo
                    bat "docker-compose -f docker-compose.yml down --rmi all --remove-orphans"
                    bat "docker-compose -f docker-compose.rollback.yml down --remove-orphans"
                }
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Check Port Availability') {
            steps {
                script {
                    // Verificar si hay algo corriendo en el puerto deseado (ejemplo: 3000)
                    def result = bat(script: "docker ps --format '{{.Ports}}' | grep '0.0.0.0:${PORT}->${PORT}/tcp'", returnStatus: true)
                    if (result == 0) {
                        echo "¡Advertencia! El puerto ${PORT} ya está ocupado por otro contenedor o servicio."
                        currentBuild.result = 'FAILURE'
                        // Puedes decidir aquí si deseas detener Jenkins o continuar con precaución
                    } else {
                        echo "El puerto ${PORT} está disponible para desplegar."
                    }
                }
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
                        sleep time: 15, unit: 'SECONDS'
                        // Verify the deployment
                        // Deploy using docker-compose.yml
                       // Verificar el estado del contenedor 'backend'
                        def result = bat(script: 'docker ps --filter "name=backend" --filter "status=running" -q', returnStdout: true).trim()
                    
                        // Limpiar la salida, eliminando posibles líneas de comandos adicionales
                        def containerId = result.split('\n').find { it =~ /^[a-f0-9]{12}$/ }?.trim()

                        echo "Resultado de docker ps: '${containerId}'"
                        
                        // Verificar si el contenedor está en ejecución
                        if (containerId) {
                            echo 'El contenedor "backend" está en ejecución.'
                        } else {
                            echo 'El contenedor "backend" no está en ejecución o no se encontraron contenedores.'
                            currentBuild.result = 'FAILURE'
                            rollback()
                            // Aquí podrías añadir lógica adicional para manejar el fallo
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
