.PHONY: package clean

# Directory where the packaged files will be stored
PACKAGE_DIR = package
BUILD_DIR = build_tmp
LINUX_TARBALL = $(PACKAGE_DIR)/jax-ui-linux-x64.tar.gz
MAC_TARBALL = $(PACKAGE_DIR)/jax-ui-mac-arm64.tar.gz

package: clean
	# Create build and package directories
	mkdir -p $(BUILD_DIR)
	mkdir -p $(PACKAGE_DIR)
	
	# Install pkg if not already installed
	npm install -g pkg
	
	# Build React app once
	npm run build
	
	# Create shared build directory
	mkdir -p $(BUILD_DIR)/shared
	cp -r build $(BUILD_DIR)/shared/
	
	# Package for Linux x64
	@echo "Creating Linux x64 package..."
	mkdir -p $(BUILD_DIR)/linux
	pkg src/server.js --targets node18-linux-x64 --output $(BUILD_DIR)/linux/proxy-server
	cp .env $(BUILD_DIR)/linux/.env.example
	mkdir -p $(BUILD_DIR)/linux/certs
	cp scripts/deploy/README-linux.md $(BUILD_DIR)/linux/README.md
	
	# Package for Mac ARM
	@echo "Creating Mac ARM package..."
	mkdir -p $(BUILD_DIR)/mac
	pkg src/server.js --targets node18-macos-arm64 --output $(BUILD_DIR)/mac/proxy-server
	cp .env $(BUILD_DIR)/mac/.env.example
	mkdir -p $(BUILD_DIR)/mac/certs
	cp scripts/deploy/README-mac.md $(BUILD_DIR)/mac/README.md
	
	# Create tarballs with shared build directory
	mkdir -p $(BUILD_DIR)/../jax-ui-linux
	cp -r $(BUILD_DIR)/linux/.[!.]* $(BUILD_DIR)/linux/* $(BUILD_DIR)/../jax-ui-linux/ 2>/dev/null || true
	cp -r $(BUILD_DIR)/shared/build $(BUILD_DIR)/../jax-ui-linux/
	cd $(BUILD_DIR)/.. && COPYFILE_DISABLE=1 tar --exclude="._*" -czf $(LINUX_TARBALL) jax-ui-linux/
	rm -rf $(BUILD_DIR)/../jax-ui-linux
	
	mkdir -p $(BUILD_DIR)/../jax-ui-mac
	cp -r $(BUILD_DIR)/mac/.[!.]* $(BUILD_DIR)/mac/* $(BUILD_DIR)/../jax-ui-mac/ 2>/dev/null || true
	cp -r $(BUILD_DIR)/shared/build $(BUILD_DIR)/../jax-ui-mac/
	cd $(BUILD_DIR)/.. && COPYFILE_DISABLE=1 tar --exclude="._*" -czf $(MAC_TARBALL) jax-ui-mac/
	rm -rf $(BUILD_DIR)/../jax-ui-mac
	
	# Clean up build directory
	rm -rf $(BUILD_DIR)
	rm -rf build

clean:
	rm -rf $(BUILD_DIR)
	rm -rf $(PACKAGE_DIR)
	rm -rf jax-ui-linux jax-ui-mac
	rm -rf build 