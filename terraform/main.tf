provider "aws" {
  region  = "eu-west-2"
  version = "~> 2.0"
}

provider "template" {
  version = "~> 2.0"
}

terraform {
  backend "s3" {
    bucket  = "hackney-mat-state-storage-s3"
    encrypt = true
    region  = "eu-west-2"
    key     = "services/thc/state"
  }
}

data "aws_iam_role" "ec2_container_service_role" {
  name = "ecsServiceRole"
}

data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

module "development" {
  # We pin to `master` for now, until we have tagged releases of the modules.
  source = "git@github.com:LBHackney-IT/aws-mat-components-per-service-terraform.git//modules/environment/frontend?ref=master"

  environment_name = "development"
  application_name = "thc"

  security_group_name_prefix = "mat-frontend-sg"
  lb_prefix                  = "hackney-ext-mat-alb"

  # Note that this process should only use ports in the 200X range to avoid port
  # clashes.
  port = 2001

  listener_port = 80
  path_pattern  = "thc"

  desired_number_of_ec2_nodes = 2

  ecs_execution_role = "${data.aws_iam_role.ecs_task_execution_role.arn}"
  lb_iam_role_arn    = "${data.aws_iam_role.ec2_container_service_role.arn}"

  task_definition_environment_variables = {
    NODE_ENV = "production"

    BASE_PATH        = "/thc"
    ENVIRONMENT_NAME = "development"

    PROCESS_API_HOST     = "4cgb2c6pqe.execute-api.eu-west-2.amazonaws.com"
    PROCESS_API_BASE_URL = "/development/mat-process/api"

    MAT_API_HOST     = "g6bw0g0ojk.execute-api.eu-west-2.amazonaws.com"
    MAT_API_BASE_URL = "/development/manage-a-tenancy-api"
  }

  task_definition_environment_variable_count = 1

  task_definition_secrets      = {}
  task_definition_secret_count = 0
}
