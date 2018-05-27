-- Create database twProj;
-- Use twProj;

DROP TABLE sessions;
DROP TABLE options;
DROP TABLE scores;
DROP TABLE users;

CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL,
                    username varchar(32) NOT NULL UNIQUE,
                    password varchar(32) NOT NULL,
                    PRIMARY KEY (id)
                    );
CREATE TABLE scores (id INT AUTO_INCREMENT NOT NULL,
                     user_id INT NOT NULL,
                     time INT NOT NULL,
                     deaths INT NOT NULL,
                     FOREIGN KEY (user_id) REFERENCES users(id),
                     PRIMARY KEY (id)
                    );

CREATE TABLE options (id INT AUTO_INCREMENT NOT NULL,
                     user_id INT NOT NULL,
                     left_key INT NOT NULL,
                     right_key INT NOT NULL,
                     down_key INT NOT NULL,
                     jump_key INT NOT NULL,
                     dash_key INT NOT NULL,
                     music_volume INT NOT NULL,
                     sound_volume INT NOT NULL,
                     FOREIGN KEY (user_id) REFERENCES users(id),
                     PRIMARY KEY (id)
                     );
CREATE TABLE sessions (id INT AUTO_INCREMENT NOT NULL,
                       user_id INT NOT NULL,
                       session_id varchar(50) NOT NULL,
                       FOREIGN KEY (user_id) REFERENCES users(id),
                       PRIMARY KEY (id)
                    );