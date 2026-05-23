package com.email.email_writer;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {"gemini.api.key=test-key","gemini.api.url=http://localhost"})
class EmailWriterApplicationTests {

	@Test
	void contextLoads() {
	}

}
