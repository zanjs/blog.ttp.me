---
title: Spring Boot的@ComponentScan
date: 2019-03-20 13:03:19
category: spring-boot
---

Spring Boot的 @ComponentScan 错误提示

```t
Redundant declaration: @SpringBootApplication already applies given @ComponentScan less... (Ctrl+F1) 
Inspection info: Checks Spring Boot Application Setup.
@SpringBootApplication used in default package
Redundant @ComponentScan declaration
Redundant @EnableAutoConfiguration declaration
```



很多Spring Boot开发者经常使用@Configuration，@EnableAutoConfiguration，@ComponentScan注解他们的main类，由于这些注解如此频繁地一块使用（特别是遵循以上[最佳实践](14. Structuring your code.md)的时候），Spring Boot就提供了一个方便的@SpringBootApplication注解作为代替。



@SpringBootApplication注解等价于以默认属性使用@Configuration，@EnableAutoConfiguration和@ComponentScan：

```java
package com.example.myproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // same as @Configuration @EnableAutoConfiguration @ComponentScan
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

注: @SpringBootApplication注解也提供了用于自定义@EnableAutoConfiguration和@ComponentScan属性的别名（aliases）。