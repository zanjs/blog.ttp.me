---
title: Javascript 设计模式-工厂模式
date: 2019-03-05 20:03:19
category: javascript
---

## 简单工厂

简单工厂模式是由一个方法来决定到底要创建哪个类的实例, 而这些类通常都拥有相同的接口（属性和方法）。

- 举例：计算器（加、减、乘、除）
- 自行车售卖（山地、公路）
- 饮料机（咖啡、牛奶、水）
- RPG中职业（战士、法师、射手）
- 这里就以RPG中职业（战士、法师、射手）来做说明：

```js
// 先创建各个角色的构造函数
function  Warrior() {
	this.skill = '回血';
	this.blood = 150; // 初始化生命值
	this.hit = 8; // 普通攻击伤害
	// 其他特有属性和方法比如生命值
	console.log(this);
}
function  Mage() {
	this.skill = '冰冻';
	this.blood = 120; // 初始化生命值
	this.hit = 3; // 普通攻击伤害
	// 其他特有属性和方法
	console.log(this);
}
function  Archer() {
	this.skill = '消耗';
	this.blood = 110; // 初始化生命值
	this.hit = 10; // 普通攻击伤害
	// 其他特有属性和方法
	console.log(this);
}
// 工厂对象 可以是普通对象是的方法 和 构造函数，这里使用前者
const RoleFactory = {
	createRole (role) {
		let roler;
		switch (role) {
			case '战士':
				roler = new Warrior();
				break;
			case '法师':
				roler = new Mage();
				break;
			case '射手':
				roler = new Archer();
				break;
			// 后续扩展角色直接追加选择语句和添加角色构造函数
			defaulr: 
				roler = new Warrior();
		}
	}
};
Object.freeze(RoleFactory); // 冻结该对象，防止他人操作
// 创建各个角色的实例
var warrior1 = RoleFactory.createRole('战士'); // 创建一个战士
var mage1 = RoleFactory.createRole('法师'); // 创建一个法师
var arche1 = RoleFactory.createRole('射手'); // 创建一个射手
```


其实我们还可以这样设计工厂处理函数

```js
const RoleFactory = function (role) {
	return new role ();
}
var warrior1 = RoleFactory(Warrior); // 创建一个战士
var mage1 = RoleFactory(Mage); // 创建一个法师
var arche1 = RoleFactory(Archer); // 创建一个射手
```

什么时候使用工厂模式

1. 对象的构建十分复杂
2. 需要依赖具体环境创建不同实例
3. 处理大量具有相同属性的小对象
   1. >> 参考文档：
      1. [JS设计模式之工厂模式](http://www.cnblogs.com/coiorz/p/4806550.html)
      2. [js之简单工厂模式](http://www.cnblogs.com/myzy/p/5240457.html)