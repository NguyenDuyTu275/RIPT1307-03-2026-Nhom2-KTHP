package com.Nhom2.booking.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO nhận webhook từ Sepay khi có giao dịch ngân hàng mới.
 * Docs: https://docs.sepay.vn/webhook.html
 */
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SepayWebhookRequest {

    private Long id;

    private String gateway;

    @JsonProperty("transactionDate")
    private String transactionDate;

    @JsonProperty("accountNumber")
    private String accountNumber;

    private String code;

    private String content;

    @JsonProperty("transferType")
    private String transferType;

    @JsonProperty("transferAmount")
    private Long transferAmount;

    private Long accumulated;

    @JsonProperty("subAccount")
    private String subAccount;

    @JsonProperty("referenceCode")
    private String referenceCode;

    private String description;
}
