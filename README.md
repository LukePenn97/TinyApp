# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot of urls page"](https://github.com/LukePenn97/tinyapp/blob/master/docs/urls_page.png)
!["screenshot of register page"](https://github.com/LukePenn97/tinyapp/blob/master/docs/register_page.png)
!["screenshot of login page"](https://github.com/LukePenn97/tinyapp/blob/master/docs/login_page.png)
!["screenshot of create page"](https://github.com/LukePenn97/tinyapp/blob/master/docs/create_page.png)
!["screenshot of edit page"](https://github.com/LukePenn97/tinyapp/blob/master/docs/edit_page.png)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- cookie-session
- - note: body-parser was deprecated because Express has the same functionality now, so I used the express method instead

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Functionality

- Create short URL links and save them to your account
- Edit and delete links
- Track the number of times your url has been clicked on, how many unique clicks, and list the visitor ids and timestamps for each click.
