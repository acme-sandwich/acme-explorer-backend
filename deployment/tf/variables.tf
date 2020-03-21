# variable "access_key" {
#     description = "AWS access key"
#     type        = string
#     default     = ""
# }

# variable "secret_key" {
#     description = "AWS secret key"
#     type        = string
#     default     = ""
# }

variable "author" {
  description = "Name of the operator. Used as a prefix to avoid name collision on resources."
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1" # Paris
}

variable "key_path" {
  description = "Key path for SSHing into EC2"
  type        = string
  default     = "./keys/DO1920_04.pem"
}

variable "key_name" {
  description = "Key name for SSHing into EC2"
  type        = string
  default     = "DO1920_04"
}