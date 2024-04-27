---
title: Lisp 入门
---

## 运行 Scheme

Scheme 是 Lisp 的方言版本。

1. 下载 [Racket](https://download.racket-lang.org/) 来运行 Scheme。
2. 下载后打开 DrRacket 选择 Language > 选择 Choose Language
  <details class="details-image">
    <summary>图片</summary>

![lisp](/images/lisp-01.png)

  </details>

3. 选择 Beginning Student（初学者模式），点击 OK。
  <details class="details-image">
    <summary>图片</summary>

![lisp](/images/lisp-02.png)

  </details>
  

## DrRacket 的使用

DrRacket 的上半部分负责命名，下半部分负责运算。上半部分修改后需要重新 run 才会生效。

<details class="details-image">
  <summary>图片</summary>

![lisp](/images/lisp-03.png)

</details>

## Lisp 的基本语法

注释写法

```lisp
(+ 1 1); 1+1 分号后就是注释
```

简单的四则运算

```lisp
(+ 1 2); 1+2
(- 3 2); 3-2
(* 4 5); 4*5
(/ 6 2); 6/2
```

四则运算升级

```lisp
(+ 1 2 3); 1+2+3
(- 3 2 1); 3-2-1
(* 4 5 6); 4*5*6
(/ 6 2 3); 6/2/3
```

小数

```lisp
(+ 1.5 2); 3.5
.1       ; 0.1
```

更复杂的运算

```lisp
(+ (* 3 ( + (* 2 4) (+ 3 5) ) ) (+ (- 10 6) 7) )
```

如果觉得看起来乱，可以将上面的语法用树形结构书写

```lisp
(+ 
  (* 3
    ( +
      (* 2 4) (+ 3 5)
    )
  )
  (+ (- 10 6) 7)
)
```

命名（很像变量）声明一个数字

```lisp
(define x 10)
(* x 2); 20
```

复合过程（很像函数）求两个数的平方

```lisp
(define (square n) (* n n) )
(square 10); 100
```

还可以结合上面的例子实现求一个数的平方和

```lisp
(define (sum-of-square x y) (+ (square x) (square y)))
(sum-of-square 3 4); 25
```

代入法

```lisp
(define (f a) (sum-of-square (+ a 1) (* a 2)))
(f 5); 136
```

上面的代入法求值有两种计算过程

1. 应用序（参数先求值，再代入过程）
2. 正常序（参数不求值，全部代入，最后求值）

## 条件判断

在 Lisp 中，条件判断可以这么写，假如我们要求一个数的绝对值：

```lisp
(define x (- 6))
(cond ((> x 0) x)
      ((= x 0) 0)
      ((< x 0) (- x)) )
; 结果: 6
```

可以将它封装起来

```lisp
(define (my-abs n)
  (cond
    ((> n 0) n)
    ((= n 0) 0)
    ((< n 0) (- n)) ) )
; 这样就可以执行
(my-abs (- 6)) ; 6
```

还可以使用 if 来实现

```lisp
(define (my-abs n)
  (if (> n 0) n (- n)))
```

它的意思是，如果 n > 0 就返回 n，否则就返回 `-n`

## 或且非

在 Lisp 中：or 为或，and 为且，not 为非。

使用 or 判断一个数为 2 或 5，是就返回 1，否则就返回 0 。

```lisp
(define (assign-or n)
  (if
    (or (= n 2) (= n 5)) 1 0))
; 测试
(assign-or 3); 0
(assign-or 2); 1
```

使用 and 判断一个数是否在 1-9 之间，是就返回 1 ，否就返回 0 。

```lisp
(define (small-number n) 
  (if
    (and (>= n 1) (<= n 9)) 1 0))
; 测试
(small-number 0); 0
(small-number 2); 1
(small-number 9); 1
```

使用 not 判断一个数是否为大于 0 的数，是就返回 1，否则就返回 0 。

```lisp
(define (assign-not n)
  (if
    (not (<= n 0)) 1 0))
; 测试
(assign-not 1); 1
(assign-not 0.1); 1
(assign-not 0); 0
```

求一个数的平方根

使用 JavaScript 实现

```js
function root(n) {
  return 盲猜(1, n)
}

function 盲猜(x, n) {
  if(Math.abs(x*x - n) < 0.001){
    return x
  }
  const y = n/x
  return 盲猜((x+y)/2, n)
}

root(2) // 1.4142156862745097
```

```lisp
(define (root n)
  (guess 1 n))
(define (guess x n)
  (if
    (<
      (abs
        (- (* x x) n) ) 0.001 )
    x
    (guess
      (/
        (+
          (/ n x) x ) 2 ) n ) ) )
; 测试
(root 2); 1.4142156862745098039
```

## 词法作用域

在 Lisp 中 如果define 中定义了 define 并且引用最外层 define 的值，就叫词法作用域（在本文的 DrRacket 中不支持）。

```lisp
(define (lexical n)
  (define (childer x) (x * n))
)
```

## 线性递归&线性迭代

### 以线性递归的方式实现阶乘

使用 JavaScript

```js
function f(n) {
  if (n === 1) { return 1 }
  return n * f(n - 1)
}
f(5) // 120
```

使用 Lisp

```lisp
(define (f n)
  (if
    (= n 1) 1
    (* n (f (- n 1)))
   ))
; 测试
(f 5); 120
```

Lisp 的线性递归示意图

![lisp](/images/linear-recursion.png)

### 以线性迭代的方式实现阶乘

使用 JavaScript

```js
function f(n) {
  return 迭代(1, 1, n)
}
function 迭代(i, result, n) {
  if (i > n) { return result }
  return 迭代(i + 1, i * result, n)
}
f(6) // 720
```

使用 Lisp

```lisp
(define (f n) (iterator 1 1 n))
(define (iterator i result n)
  (if 
    (> i n)
    result
    (iterator (+ i 1) (* i result) n)
  )
)
; 测试
(f 5); 120
```

### 注意

线性递归和线性迭代都是「递归」

- 线性递归和线性迭代强调的是「计算过程」
- 「递归」表示函数调用自己这种「形式」
