pipeline {
    agent any

    environment {
        docker_image = 'test_info290-backend'
        docker_container = 'test_info290'
        docker_port = 3000
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Deploy') {
            steps {
                script {
                    // Construir la imagen Docker
                    bat "docker build -t ${env.docker_image} ."

                    // Subir la imagen Docker (opcional)
                    bat "docker push ${env.docker_image}"

                    // Detener y eliminar cualquier contenedor existente
                    bat "docker stop ${env.docker_container} || true"
                    bat "docker rm ${env.docker_container} || true"

                    // Ejecutar el contenedor Docker en segundo plano con PowerShell
                    powershell """
                    Start-Process docker -ArgumentList 'run -d -p ${env.docker_port}:${env.docker_port} --name ${env.docker_container} ${env.docker_image}' -NoNewWindow -Wait
                    """

                    // Verificar si el despliegue fue exitoso
                    def result = bat(script: "docker inspect --format='{{.State.Status}}' ${env.docker_container}", returnStatus: true)

                    if (result != 0) {
                        error "Error: No se pudo iniciar el contenedor con la nueva versión."
                    }
                }
            }
        }
    }
}
