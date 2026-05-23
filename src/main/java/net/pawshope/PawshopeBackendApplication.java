package net.pawshope;

import net.pawshope.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class PawshopeBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(PawshopeBackendApplication.class, args);
    }
}
