FROM ruby:3.2

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

ENV RAILS_ENV=production
ENV RAILS_SERVE_STATIC_FILES=true

EXPOSE 3000

CMD ["bash", "-c", "bundle exec rails db:migrate && bundle exec rails server -b 0.0.0.0 -p $PORT"]
