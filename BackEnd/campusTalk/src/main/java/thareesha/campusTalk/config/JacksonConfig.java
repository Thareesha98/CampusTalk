package thareesha.campusTalk.config;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public Hibernate6Module hibernate6Module() {
        Hibernate6Module module = new Hibernate6Module();

        // Optional: Don’t force lazy loading during serialization
        module.disable(Hibernate6Module.Feature.FORCE_LAZY_LOADING);

        // Optional: Serialize lazy fields as null instead of proxy objects
        module.enable(Hibernate6Module.Feature.SERIALIZE_IDENTIFIER_FOR_LAZY_NOT_LOADED_OBJECTS);

        return module;
    }
}
