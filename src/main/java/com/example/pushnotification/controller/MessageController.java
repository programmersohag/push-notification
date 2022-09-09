package com.example.pushnotification.controller;

import com.example.pushnotification.dto.Message;
import com.example.pushnotification.dto.ResponseMessage;
import com.example.pushnotification.service.NotificationService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.security.Principal;

@Controller
public class MessageController {

    private final NotificationService notificationService;

    public MessageController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @MessageMapping("/global-message")
    @SendTo("/topic/global-messages")
    public ResponseMessage getMessage(final Message message) throws InterruptedException {
        Thread.sleep(1000);
        notificationService.sendGlobalNotification();
        return new ResponseMessage(HtmlUtils.htmlEscape(message.getMessageContent()));
    }

    @MessageMapping("/private-message")
    @SendToUser("/topic/private-messages")
    public ResponseMessage getPrivateMessage(final Message message, final Principal principal) throws InterruptedException {
        Thread.sleep(1000);
        String user = principal.getName();
        notificationService.sendPrivateNotification(user);
        return new ResponseMessage(HtmlUtils.htmlEscape("private user " + user + " message : " + message.getMessageContent())
        );
    }
}
