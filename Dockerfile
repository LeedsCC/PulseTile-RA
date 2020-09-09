FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY build /usr/share/nginx/html

COPY run/k8s/conf/nginx.conf /etc/nginx
COPY run/k8s/conf/default.conf /etc/nginx/conf.d