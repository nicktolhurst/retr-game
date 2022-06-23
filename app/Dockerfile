FROM nginx:alpine

COPY ./www ./app/www

COPY ./nginx/nginx.conf /etc/nginx/nginx.template

CMD sh -c "envsubst \"`env | awk -F = '{printf \" \\\\$%s\", $1}'`\" < /etc/nginx/nginx.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"