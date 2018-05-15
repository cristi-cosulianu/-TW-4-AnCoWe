Create database twProj;
Use twProj;
CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL,
                    username varchar(32) NOT NULL,
                    password varchar(32) NOT NULL,
                    PRIMARY KEY (id)
                    );
CREATE TABLE scores (user_id INT NOT NULL,
                     score INT NOT NULL,
                     FOREIGN KEY (user_id) REFERENCES users(id)
                    );

CREATE TABLE options (user_id INT NOT NULL,
                     left_key INT NOT NULL,
                     right_key INT NOT NULL,
                     down_key INT NOT NULL,
                     jump_key INT NOT NULL,
                     dash_key INT NOT NULL,
                     music_volume INT NOT NULL,
                     sound_volume INT NOT NULL,
                     FOREIGN KEY (user_id) REFERENCES users(id)
                     );
CREATE TABLE sessions (user_id INT NOT NULL,
                       session_id varchar(50) NOT NULL,
                       FOREIGN KEY (user_id) REFERENCES users(id)
                    );