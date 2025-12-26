import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as n,a as l,b as i,c as g,d as t,I as o,e as w,B as c}from"./Card-CXERcaum.js";import"./index-CC6F48bw.js";const D={title:"Components/Card",component:n,parameters:{layout:"centered"},tags:["autodocs"]},r={render:a=>e.jsxs(n,{className:"w-[350px]",...a,children:[e.jsxs(l,{children:[e.jsx(i,{children:"Create project"}),e.jsx(g,{children:"Deploy your new project in one-click."})]}),e.jsx(t,{children:e.jsx("div",{className:"grid gap-4",children:e.jsx("div",{className:"flex flex-col space-y-1.5",children:e.jsx(o,{id:"name",placeholder:"Name of your project"})})})}),e.jsxs(w,{className:"flex justify-between",children:[e.jsx(c,{variant:"outline",children:"Cancel"}),e.jsx(c,{children:"Deploy"})]})]})},s={render:a=>e.jsxs(n,{className:"w-[350px]",...a,children:[e.jsx(l,{children:e.jsx(i,{children:"Simple Card"})}),e.jsx(t,{children:"This is a simple card with just header and body."})]})},d={render:a=>e.jsxs(n,{className:"w-[350px]",...a,children:[e.jsxs(l,{children:[e.jsx(i,{children:"Login"}),e.jsx(g,{children:"Enter your credentials to access your account."})]}),e.jsxs(t,{className:"space-y-4",children:[e.jsx("div",{className:"space-y-2",children:e.jsx(o,{id:"email",type:"email",placeholder:"m@example.com"})}),e.jsx("div",{className:"space-y-2",children:e.jsx(o,{id:"password",type:"password",placeholder:"Password"})})]}),e.jsx(w,{children:e.jsx(c,{className:"w-full",children:"Sign In"})})]})};var p,m,C;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardBody>
        <div className="grid gap-4">
          <div className="flex flex-col space-y-1.5">
            <Input id="name" placeholder="Name of your project" />
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
}`,...(C=(m=r.parameters)==null?void 0:m.docs)==null?void 0:C.source}}};var u,x,j;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: args => <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardBody>
        This is a simple card with just header and body.
      </CardBody>
    </Card>
}`,...(j=(x=s.parameters)==null?void 0:x.docs)==null?void 0:j.source}}};var y,h,N;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: args => <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="space-y-2">
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="space-y-2">
          <Input id="password" type="password" placeholder="Password" />
        </div>
      </CardBody>
      <CardFooter>
        <Button className="w-full">Sign In</Button>
      </CardFooter>
    </Card>
}`,...(N=(h=d.parameters)==null?void 0:h.docs)==null?void 0:N.source}}};const S=["Default","Simple","Login"];export{r as Default,d as Login,s as Simple,S as __namedExportsOrder,D as default};
