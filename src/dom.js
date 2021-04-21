window.dom = {
    create(string) {//创建节点
        const container = document.createElement("template");
        container.innerHTML = string.trim();//trim去掉字符串两边的空格
        return container.content.firstChild;
    //     const container = document.createElement("div"); //div不能容纳<td>元素，<td>只能存放在table里，所以用template，它可以容纳所有元素
    //     container.innerHTML = string;
    //     return container.children[0]; //template不能用这种方法获取
     },
     after(node, node2){//新增弟弟
         node.parentNode.insertBefore(node2, node.nextSibling);//插到node的下一个孩子的前面
     },
     before(node, node2){//新增哥哥
        node.parentNode.insertBefore(node2, node);//插到node的前面
    },
    append(parent, node){//新增儿子
        parent.appendChild(node);
    },
    wrap(node, parent){//新增爸爸
        dom.before(node, parent);//先把parent插到node前面
        dom.append(parent, node);//再把node变成parent的孩子（append后，原位置的节点会自动消失）
    },
    remove(node){//删除节点
        node.parentNode.removeChild(node);
        return node
    },
    empty(node){//删除某个节点的孩子们
        const {childNodes} = node;//即childNodes = node.childNodes的简写
        const array = [];
        let x = node.firstChild;
        while(x){
            array.push(dom.remove(node.firstChild));
            x = node.firstChild;
        }
        return array;
    },
    attr(node, name, value){//读写属性，重载
        if(arguments.length === 3){//写
            node.setAttribute(name, value);
        }else if(arguments.length === 2){//读
            return node.getAttribute(name);
        }
    },
    text(node, string){//读写文本内容，适配
        if(arguments.length === 2){//设置内容
            if('innerText' in node){//ie
                node.innerText = string;
            }else{//chrome+firefox
                node.textContent = string;
            }
        }else if(arguments.length === 1){//获取文本内容
            if('innerText' in node){//ie
                return node.innerText;
            }else{//chrome+firefox
                return node.textContent;
            }
        }
        
    },
    html(node, string){//读写HTML内容
        if(arguments.length === 2){//设置内容
            node.innerHTML = string;
        }else if(arguments.length === 1){
            return node.innerHTML;
        }
    },
    style(node, name, value){
        if(arguments.length === 3){//dom.style(test, `color`, `red`)
            node.style[name] = value
        }else if(arguments.length === 2){
            if(typeof name === `string`){//dom.style(test, `border`)
                return node.style[name]
            }else if(name instanceof Object){//dom.style(test, {color: `blue`})
                const object = name;
                for(let key in object){
                    node.style[key] = object[key];//用变量做key，必须放在中括号里面，直接.key会使之变成字符串
                }
            }
        }
    },
    class: {
        add(node, className){
            node.classList.add(className);
        },
        remove(node, className){
            node.classList.remove(className);
        },
        has(node, className){
            return node.classList.contains(className);
        }
    },
    on(node, eventName, fn){
        node.addEventListener(eventName, fn);
    },
    off(node, eventName, fn){
        node.removeEventListener(eventName, fn);
    },
    find(selector, scope){//dom.find(`#test`)[0]使用时注意加[0]
        return (scope || document).querySelectorAll(selector);
    },
    parent(node){//找父亲
        return node.parentNode;
    },
    children(node){//找孩子
        return node.children;
    },
    siblings(node){//把伪数组变成数组后，过滤节点本身，得到siblings
        return Array.from(node.parentNode.children).filter(n => n !== node)
    },
    next(node){
        let x = node.nextSibling;
        while(x && x.nodeType === 3){
            x = x.nextSibling
        }
        return x  
    },
    previous(node){
        let x = node.previousSibling;
        while(x && x.nodeType === 3){
            x = x.previousSibling
        }
        return x
    },
    each(nodeList, fn){
        for(let i=0; i<nodeList.length; i++){
            fn.call(null, nodeList[i])
        }
    },
    index(node){
        const list = dom.children(node.parentNode);
        let i
        for(i=0; i<list.length; i++){
            if(list[i] === node){
                break;
            }
        }
        return i;
    }
};

