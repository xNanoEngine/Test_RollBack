pipeline {
    agent any

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
                    bat "docker build -t nombre_de_la_imagen ."

                    // Subir la imagen Docker (opcional)
                    bat "docker push nombre_de_la_imagen"

                    // Detener y eliminar cualquier contenedor existente
                    bat "docker stop nombre_del_contenedor || true"
                    bat "docker rm nombre_del_contenedor || true"

                    // Ejecutar el contenedor Docker en segundo plano con PowerShell
                    powershell """
                    Start-Process docker -ArgumentList 'run -d -p 3000:3000 --name nombre_del_contenedor nombre_de_la_imagen' -NoNewWindow -Wait
                    """

                    // Verificar si el despliegue fue exitoso
                    def result = bat(script: "docker inspect --format='{{.State.Status}}' nombre_del_contenedor", returnStatus: true)

                    if (result != 0) {
                        error "Error: No se pudo iniciar el contenedor con la nueva versión."
                    }
                }
            }
        }
    }
}
