(function(w){
    w.geDom = (function(){
      'use strict'
      let checker={
          isArray:function(){
              return Array.isArray(arguments[0]);
          },
          isString:function(){
              return "string" == typeof arguments[0]
          },
          isFunction:function(){
              return "function" == typeof arguments[0]
          },
          isJSON:function(){
              return "object" == typeof arguments[0] && !this.isArray(arguments[0])
          },
          hasKeys:function(o,v){
              if(this.isJSON(o)){
                  if(this.isString(v)){
                      return o.hasOwnProperty(p)
                  }else if(this.isArray(v)){
                      var estatus = true;
                      v.forEach(function(e){
                          estatus = estatus && this.hasKeys(o,e)
                      })
                      return estatus
                  }
              }
          }
      }  

      function dibujason(config){
          if(!checker.isJSON(config) || !config.hasOwnProperty("tag")){
            return;
          }
          var e = document.createElement(config.tag),
              mut = new NodeMutator(e);
          if(config.hasOwnProperty("class") && config.class)
            mut.addClass(config.class)
          if(config.hasOwnProperty("attrs") && config.attrs)
            Object.keys(config.attrs).forEach(function(key){ mut.attr(key,config.attrs[key]) })
          if(config.hasOwnProperty("style") && config.style)
            Object.keys(config.style).forEach(function(key){ mut.style(key,config.style[key]) })
          if(config.hasOwnProperty("content") && config.content)
            mut.addContent(config.content)
          if(config.hasOwnProperty('evt') )
              mut.addEventListener(config.evt)
          return e;
      }
     
      function NodeMutator(element){
        this.body = element
        this.parent = element.parentElement
        this.next = element.nextElementSibling
        this.prev = element.previousElementSibling
      }
          NodeMutator.prototype.style=function(attr,val){
            if(!val){
              return this.body.style[attr]
            }
            this.body.style[attr] = val
            return this
          }
          NodeMutator.prototype.addClass=function(cl){
            if(!cl || "string" != typeof cl)
               return false;
            var mutator = this
            cl.split(" ").forEach(function(c){ mutator.body.classList.add(c)})
            return this
          }
          NodeMutator.prototype.removeClass=function(cl){
            this.body.classList.remove(cl);
            return this
          }
          NodeMutator.prototype.hasClass=function(cl){
            return this.body.classList.contains(cl)
          }
          NodeMutator.prototype.toggleClass=function(cl){
              var mutator = this;
              cl.split(" ").forEach(function(c){
                  if(!mutator.hasClass(c)){
                       mutator.addClass(c)
                  }else{
                      mutator.removeClass(c)
                  }
              })
            return this
          }
          NodeMutator.prototype.attr=function(k,v){
            if(!v)
                return this.body[k]
            this.body.setAttribute(k,v)
            return this;
          }
          NodeMutator.prototype.removeAttr=function(attr){
              this.body.removeAttribute(attr)
          }
          NodeMutator.prototype.addContent=function(content){
              var mut = this
              if(checker.isArray(content)){
                content.forEach(function(co){
                  mut.addContent(co)
                })
              }else if(checker.isJSON(content)){
                mut.body.appendChild(dibujason(content))
              }else if(checker.isString(content) || content.tagName){
                  mut.body.innerText += content
              }else if(checker.isFunction(content)){
                  mut.addContent(content())
              }
 
          }
          NodeMutator.prototype.addEventListener=function(evt,cback){
              var mutator = this,
                  body = mutator.body;
              if(checker.isString(evt) && checker.isFunction(cback)){
                  body.addEventListener(evt,cback)
              }else if(checker.isJSON(evt) && evt.hasOwnProperty("trigger") && evt.hasOwnProperty("action")){
                  mutator.addEventListener(evt.trigger, evt.action)
              }else if(checker.isArray(evt)){
                  evt.forEach(function(e){
                      mutator.addEventListener(e)
                  })
              }
          }     
     
      return {
        checker:checker,
        m:NodeMutator,
        draw:dibujason,        
      }
  })()
  Object.freeze(w.geDom)
 })(self)