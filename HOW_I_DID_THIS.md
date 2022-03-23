load docker image
-----------------
	docker run --rm -v ${PWD}:/usr/src -w /usr/src -ti timbru31/ruby-node /bin/bash

inside docker container, create rails app
-----------------------------------------

	gem install rails
	
	rails new react-app --webpack=react
	
set permissions, move source to parent folder since it created source in react-app

add for .gitignore for emacs:
	*~
	.*~
	

add Dockerfile
--------------

(File contents:)

FROM timbru31/ruby-node
ENV RAILS_ENV=development
# Set the workdir inside the container
WORKDIR /usr/src/app

# Set the gemfile and install
COPY Gemfile* ./

#RUN bundle _2.3.7_ config set --local without 'production'
#RUN bundle _2.3.7_ install

RUN bundle config set --local without 'production'
RUN bundle install


# For specific apps, mine that I'm working on now I will use webpacker
RUN gem install rails


# run this (not in docker) to install more modules in rails app source
# do this only after the gemfiles for webpacker is added in Gemfile.
# RUN rails webpacker:install

# for db client
RUN apt update -y
RUN apt install sqlite3 -y

# Copy the main application.
COPY . ./



# Expose port 3000 to the Docker host, so we can access it
# from the outside.
EXPOSE 3000

# The main command to run when the container starts. Also
# tell the Rails dev server to bind to all interfaces by
# default.
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]


(end file contents)



	

Modify Gemfile
--------------

I. disable sqlite3 at top since it will appear again in another group, and only that group:

	#gem 'sqlite3', "~> 1.4" 

	
II. add to this group:

(begin text)
group :development, :test do
  gem 'sqlite3', '1.4.2'
 
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem 
  gem "debug", platforms: %i[ mri mingw x64_mingw ]

  # use ???
  #gem 'byebug',  '11.1.3', platforms: [:mri, :mingw, :x64_mingw]
end
(end text)



III. add production group:

(begin text)
# I use heroku
group :production do
  gem 'pg', '1.2.3'
end
(end text)


IV. add this at bottom for webpacker:

(begin text)
#  *** STEP 2 ****

# enable these after container is run, and install them in container with:
#         bundle
# and then in the container, install source with "rails webpacker:install"
gem 'webpacker', '~>3.0'
# because 4 does major breaking change for aliases on by default, and other gems need to update for that
gem 'psych', '< 4'
(end text)





run container to login to container:
-------------

	docker run --rm -v ${PWD}:/usr/src -w /usr/src -ti timbru31/ruby-node /bin/bash


           
Run bundle (Inside container, with container running)
---------

	gem install rails
	bundle config set --local without 'production'
	bundle install
	rails webpacker:install

Exit and close container


build Dockerfile: (maybe not necessary?)
-----------------

	docker build -t my_project .
	
Startup will work:
------------------
	docker run \
	-p 3000:3000 \
	-v $(pwd):/usr/src/app/ \
	my_project

go to http://0.0.0.0:3000/



Remove .babelrc
---------------
	mv .babelrc .babelrc_DELETE
	

More installation for webpacker
-------------------------------

login to container (assuming it's still running from step "Startup")
	docker exec -it $(docker ps -q) /bin/bash
		
in the docker shell:

	curl --compressed -o- -L https://yarnpkg.com/install.sh | bash
(maybe exit and login again to continue?)
        yarn add @rails/webpacker
        bundle update webpacker

exit shell
		

Do another docker build/docker run
----------------------------------

	docker build -t my_project .
	
	docker run \
	-p 3000:3000 \
	-v $(pwd):/usr/src/app/ \
	my_project

go to http://0.0.0.0:3000/


	
Set Postgres as DB instead of sqlite3
-------------------------------------

change database.yaml config to have "postgresql" for production. Name the database.




Add to github
-------------
	
This assumes source was already being added to git. And ssh key already checked in.

Follow github steps to create new branch main. But be sure to use SSH (NOT https) for auth. Example:
git remote add origin git@github.com:lacma2011/rails-react.git



Push to heroku
--------------

Assuming heroku command line app is already installed and I have an account already. Login and create new dyno and push to it:

	heroku login
	heroku create
	heroku buildpacks:add --index 1 heroku/nodejs
	heroku buildpacks:add --index 2 heroku/ruby
	heroku config:set NPM_CONFIG_PRODUCTION=false YARN_PRODUCTION=false
	git push heroku main
	heroku run rake yarn:install
	
to see apps:
	heroku apps:info

Open homepage, which should be a custom 404 rails message since no route is set up for that yet.


