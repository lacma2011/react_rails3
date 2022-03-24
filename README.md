Clone this repo:

	git clone https://github.com/lacma2011/react_rails3 .



build the docker container (using its Dockerfile):

	docker build -t my_project .


launch a container for the same docker image. This also logs you into the container:

	docker run --rm -v ${PWD}:/usr/src -w /usr/src -ti timbru31/ruby-node /bin/bash


Inside the container (you will be at /usr/src/), run "yarn install" to install packages:

	/usr/src# yarn install
	
After yarn installs, you can exit out of that container since you wont need it anymore.
	
	/usr/src# exit
	
	

Start up the rails server using a docker container:

        docker run \
        -p 3000:3000 \
        -v $(pwd):/usr/src/app/ \
        my_project
        
        
Now you can view the react app!

	http://0.0.0.0:3000
	


For Heroku:

	heroku login
        heroku create
        heroku buildpacks:add --index 1 heroku/nodejs
        heroku buildpacks:add --index 2 heroku/ruby
        heroku config:set NPM_CONFIG_PRODUCTION=false YARN_PRODUCTION=false
        git push heroku main
        heroku run rake yarn:install   (may not be necessary since the push should install yarn packages)
        
        
        
For details on how I set up this rails app and react app, you can view the step-by-step on these two files:

	HOW_I_DID_THIS.md
		-- installing rails 7 with webpacker using docker for dev machine and heroku for server.
		
	MAKING_REACT_APP
		-- creating the react app and its components with the previous install

	
