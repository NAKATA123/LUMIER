FROM ruby:3.2

WORKDIR /app

RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  nodejs

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

ENV RAILS_SERVE_STATIC_FILES=true
ENV SECRET_KEY_BASE=dummy

RUN bundle exec rails assets:precompile

EXPOSE 3000

CMD ["bash", "-c", "bundle exec rails server -b 0.0.0.0 -p $PORT"]