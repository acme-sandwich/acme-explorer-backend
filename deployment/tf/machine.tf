resource "aws_instance" "machine01" {
  ami                         = "ami-0fc61db8544a617ed" // "ami-2757f631"
  instance_type               = "t2.micro" # medium = 4Gb, small = 2Gb, micro = 1Gb, nano= 0.5Gb   
  associate_public_ip_address = true
  key_name                    = var.key_name
  vpc_security_group_ids      = [aws_security_group.sg_lowcomote.id]

  root_block_device {
    volume_size = 20 #20 Gb
  }

  tags = {
    Name        = "${var.author}.acme-explorer"
    Author      = var.author
    Date        = "2020.02.21"
    Environment = "LAB"
    Location    = "Paris"
    Project     = "Acme-Explorer"
  }

  connection {
    type        = "ssh"
    host        = self.public_ip
    user        = "ec2-user"
    private_key = file(var.key_path)
  }

  provisioner "remote-exec" {
    inline = [
      "sudo yum update -y",
      "sudo yum install -y docker",
      "sudo service docker start",
      "sudo curl -L \"https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose",
      "sudo chmod +x /usr/local/bin/docker-compose",
      "sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose",
      "sudo docker volume create portainer_data",
      "sudo docker run -d -p 8000:8000 -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer",
      "sudo yum install git -y",
      "cd /",
      "sudo git clone -b \"development\" https://github.com/MIS-DO/DO1920-04.git",
      "echo \"clonado\"",
      "cd DO1920-04/deployment",
      "sudo chmod 755 setup.sh",
      "sudo chmod 755 start.sh",
      "sudo chmod 755 stop.sh",
      "sudo chmod 755 teardown.sh",
      "sudo ./setup.sh",
      "sudo ./start.sh"
    ]
  }
}
