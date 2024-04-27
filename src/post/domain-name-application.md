---
title: 域名申请教程
date: 2021-11-12T11:01:57+08:00
---

## 服务商配置

1. 在 [www.namesilo.com](https://www.namesilo.com/) 上注册一个账号（注册信息需为英文）
2. 选择一个域名，并使用支付宝购买。
3. 配置 DNS 关联 github 的 ip 地址（`A`），并关联 www 子域（`CNAME`）

> 选择 Manage My Domains （管理我的域名）可配置域名相关设置 

DNS 配置示例

| HOSTNAME | TYPE  | ADDRESS / VALUE   | DISTANCE/PRIO | TTL       | SERVICE   |
| -------- | ----- | ----------------- | ------------- | --------- | --------- |
|          | A     | 123.189.108.123   | NA            | 8808***** | 3rd-party |
|          | A     | 123.189.109.123   | NA            | 8808***** | 3rd-party |
|          | A     | 123.189.110.123   | NA            | 8808***** | 3rd-party |
|          | A     | 123.189.111.123   | NA            | 8808***** | 3rd-party |
| www      | CNAME | example.github.io | NA            | 8808***** | 3rd-party |


## GitHub 配置

1. 在 GitHub 中新建一个 `你的用户名.github.io` 仓库
2. 选择 Settings -> Pages ，在 Custom domain 选项中配置你的自定义域名（例：`example.com`）
3. 配置自定义域名 ip，参考：[管理 GitHub Pages 站点的自定义域](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)