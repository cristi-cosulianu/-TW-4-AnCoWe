Create database twProj;
Use twProj;
CREATE TABLE scores (id INT NOT NULL,
                     username varchar(30) NOT NULL,
                     score INT,
                     FOREIGN KEY (id) REFERENCES Users(id)
                    );

CREATE TABLE Options (id INT NOT NULL,
                     leftKey INT NOT NULL,
                     rightKey INT NOT NULL,
                     downKey INT NOT NULL,
                     jumpKey INT NOT NULL,
                     dashKey INT NOT NULL,
                     musicVolume INT,
                     soundVolume INT NOT NULL,
                     FOREIGN KEY (id) REFERENCES Users(id)
                     );
CREATE TABLE Users (id INT NOT NULL,
                    username varchar(30) NOT NULL,
                    password varchar(30) NOT NULL,
                    PRIMARY KEY (id)
                    );                     