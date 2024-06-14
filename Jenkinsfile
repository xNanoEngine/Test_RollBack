pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'test_info290'
        CONTAINER_NAME = 'test_info290'
        PORT = 3000
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Deploy Initial Version') {
            steps {
                script {
                    // Construir la imagen Docker
                    sh "docker build -t $DOCKER_IMAGE ."

                    // Subir la imagen Docker (opcional)
                    sh "docker push $DOCKER_IMAGE"

                    // Detener y eliminar cualquier contenedor existente
                    sh "docker stop $CONTAINER_NAME || true"
                    sh "docker rm $CONTAINER_NAME || true"

                    // Ejecutar el contenedor Docker con la nueva versión
                    sh "docker run -d -p $PORT:$PORT --name $CONTAINER_NAME $DOCKER_IMAGE"

                    // Verificar si el despliegue fue exitoso
                    def result = sh "docker inspect --format='{{.State.Status}}' $CONTAINER_NAME"

                    if (result != 'running') {
                        error "Error: No se pudo iniciar el contenedor con la primera versión."
                    }
                }
            }
        }
    }
}
