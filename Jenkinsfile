pipeline {
    agent any

    environment {
        docker_compose_version = '2.27.1'  // Versión de Docker Compose a utilizar
        docker_compose_project = 'nombre_del_proyecto'  // Nombre del proyecto de Docker Compose
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
                    // Verificar la versión de Docker Compose
                    bat "docker-compose version"

                    // Iniciar servicios definidos en docker-compose.yml
                    bat "docker-compose -f docker-compose.yml up -d"
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    // Verificar el estado de los servicios
                    bat "docker-compose -f docker-compose.yml ps"
                }
            }
        }
    }
}
