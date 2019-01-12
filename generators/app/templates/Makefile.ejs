.PHONY: help install build
.DEFAULT_GOAL= help

help: 
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-10s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

install: ## Install Ansible Galaxy roles
	ansible-galaxy install -p galaxy_roles -r requirements.yml

build: install  ## Build Packer image
	packer build -only=openstack template.json

clean:  ## Clean unused
	rm -rf galaxy_roles
	rm -f *.retry
	rm -f *.pem