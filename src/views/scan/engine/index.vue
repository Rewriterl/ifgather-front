<template>
  <div class="container">
    <Breadcrumb :items="['menu.scan', 'menu.scan.engine']" />
    <a-card class="general-card" :title="$t('scan.manager.engine')">
      <a-alert type="normal">
        <template #icon>
          <icon-exclamation-circle-fill />
        </template>
        该页面可以配置客户端端运行所需参数，用于动态下发配置信息，请认真填写！
      </a-alert>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" title="消息队列">
          <a-form
            :model="state.nsq"
            :style="{ width: '600px' }"
            @submit="handleNsqSave"
          >
            <a-form-item
              field="nsqd_host"
              tooltip="此地址用来Web端下发扫描任务使用"
              label="Tcp地址"
            >
              <a-input
                v-model="state.nsq.nsqd_host"
                placeholder="please enter your username..."
              />
            </a-form-item>
            <a-form-item
              field="nsqd_http"
              label="Http地址"
              tooltip="此地址用来Client端反馈扫描结果使用"
            >
              <a-input
                v-model="state.nsq.nsqd_http"
                placeholder="please enter your post..."
              />
            </a-form-item>
            <a-form-item
              field="time"
              label="配置更新时间"
              tooltip="Client端多久更新一次配置信息,单位分钟"
            >
              <a-input-number v-model="state.nsq.time" />
            </a-form-item>
            <a-form-item>
              <a-button html-type="submit" :status="'normal'">保存</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" title="端口扫描">
          <a-form
            :model="state.portscan"
            :style="{ width: '600px' }"
            @submit="handlePortScanSave"
          >
            <a-form-item
              field="ports"
              tooltip="80(单端口)、21,22,23(指定多个端口)、1-100(端口范围)、top100(内置top100端口)、top1000(内置top1000端口)、full(全部端口)"
              label="端口"
            >
              <a-input v-model="state.portscan.ports" />
            </a-form-item>
            <a-form-item
              field="nsqd_http"
              label="扫描速率"
              tooltip="扫描速率过大会导致扫描结果不全,外网扫描建议不超过2000"
            >
              <a-input-number v-model="state.portscan.rate" />
            </a-form-item>
            <a-form-item
              field="time"
              label="探测超时"
              tooltip="Client端多久更新一次配置信息,单位分钟"
            >
              <a-input-number v-model="state.portscan.timeout" />
            </a-form-item>
            <a-form-item field="ping" label="存活探测">
              <a-switch v-model="state.portscan.ping">
                <template #checked> ON</template>
                <template #unchecked> OFF</template>
              </a-switch>
            </a-form-item>
            <a-form-item
              field="detection"
              label="优先探测"
              tooltip="对于禁ping扫描，会扫描所有主机(不管是否存活),会浪费大量时间，可使用优先探测top100或top1000端口进行存活扫描"
            >
              <a-input v-model="state.portscan.detection" />
            </a-form-item>
            <a-form-item
              field="nmap_timeout"
              label="指纹超时"
              tooltip="指纹识别超时默认为7s"
            >
              <a-input-number v-model="state.portscan.nmap_timeout" />
            </a-form-item>
            <a-form-item
              field="waf_num"
              label="WAF过滤"
              tooltip="默认单个主机超过50个端口开放则判定为waf，不继续探测"
            >
              <a-input-number v-model="state.portscan.waf_num" />
            </a-form-item>
            <a-form-item
              field="retries"
              label="重试次数"
              tooltip="若超时则重新探测"
            >
              <a-input-number v-model="state.portscan.retries" />
            </a-form-item>
            <a-form-item field="verify" label="二次验证">
              <a-switch v-model="state.portscan.verify">
                <template #checked> ON</template>
                <template #unchecked> OFF</template>
              </a-switch>
            </a-form-item>
            <a-form-item
              field="nsq_timeout"
              label="消息队列超时"
              tooltip="返回给消息队列服务器超时时间,如果在规定时间内未扫描完则消息回退，一般全端口扫描不超时10分钟"
            >
              <a-input-number v-model="state.portscan.nsq_timeout" />
            </a-form-item>
            <a-form-item>
              <a-button html-type="submit" :status="'normal'">保存</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="3" title="子域名探测">
          <a-form
            :model="state.domain"
            :style="{ width: '600px' }"
            @submit="handleDomainSave"
          >
            <a-form-item
              field="timeout"
              tooltip="被动搜索子域名超时时间,如使用baidu搜索子域名单个模块的超时时间,单位秒"
              label="模块超时"
            >
              <a-input-number v-model="state.domain.timeout" />
            </a-form-item>
            <a-form-item
              field="max_enum_time"
              label="搜索超时"
              tooltip="被动搜索子域名所有模块整体超时时间,单位分钟,若量大,则设置长一点"
            >
              <a-input-number v-model="state.domain.max_enum_time" />
            </a-form-item>
            <a-form-item
              field="nsq_timeout"
              label="消息队列超时"
              tooltip="返回给消息队列服务器超时时间,如果在规定时间内未扫描完则消息回退,单位秒"
            >
              <a-input-number v-model="state.domain.nsq_timeout" />
            </a-form-item>
            <a-form-item>
              <a-button html-type="submit" :status="'normal'">保存</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="4" title="API密钥">
          <a-form
            :model="state.apikey"
            :style="{ width: '600px' }"
            @submit="handleApiSave"
          >
            <a-form-item
              field="shodan"
              label="Shodan"
              tooltip="用于端口扫描及子域名，免费注册：https://www.shodan.io"
            >
              <a-input v-model="state.apikey.shodan" />
            </a-form-item>
            <a-form-item
              field="binaryedge"
              label="Binaryedge"
              tooltip="用于子域名搜索，免费注册：https://app.binaryedge.io"
            >
              <a-input v-model="state.apikey.binaryedge" />
            </a-form-item>
            <a-form-item
              field="censys_token"
              label="CensysToken"
              tooltip="用于子域名搜索，免费注册：https://censys.io"
            >
              <a-input v-model="state.apikey.censys_token" />
            </a-form-item>
            <a-form-item
              field="censys_secret"
              label="CensysSecret"
              tooltip="用于子域名搜索，免费注册：https://censys.io"
            >
              <a-input v-model="state.apikey.censys_secret" />
            </a-form-item>
            <a-form-item
              field="certspotter"
              label="Certspotter"
              tooltip="用于子域名搜索，免费注册：https://sslmate.com/"
            >
              <a-input v-model="state.apikey.certspotter" />
            </a-form-item>
            <a-form-item
              field="github"
              label="Github"
              tooltip="用于子域名搜索，免费注册：https://github.com/"
            >
              <a-input v-model="state.apikey.github" />
            </a-form-item>
            <a-form-item
              field="spyse"
              label="Spyse"
              tooltip="用于子域名搜索，免费注册：https://spyse.com/"
            >
              <a-input v-model="state.apikey.spyse" />
            </a-form-item>
            <a-form-item
              field="securitytrails"
              label="Securitytrails"
              tooltip="用于子域名搜索，免费注册：https://securitytrails.com/"
            >
              <a-input v-model="state.apikey.securitytrails" />
            </a-form-item>
            <a-form-item
              field="threatbook"
              label="Threatbook"
              tooltip="用于子域名搜索，免费注册：https://x.threatbook.cn/"
            >
              <a-input v-model="state.apikey.threatbook" />
            </a-form-item>
            <a-form-item
              field="urlscan"
              label="Urlscan"
              tooltip="用于子域名搜索，免费注册：https://urlscan.io/"
            >
              <a-input v-model="state.apikey.urlscan" />
            </a-form-item>
            <a-form-item
              field="virustotal"
              label="Virustotal"
              tooltip="用于子域名搜索，免费注册：https://www.virustotal.com/"
            >
              <a-input v-model="state.apikey.virustotal" />
            </a-form-item>
            <a-form-item>
              <a-button html-type="submit" :status="'normal'">保存</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="5" title="Web探测">
          <a-form
            :model="state.webinfo"
            :style="{ width: '600px' }"
            @submit="handleWebinfoSave"
          >
            <a-form-item
              field="wappalyzertimeout"
              tooltip="用于web指纹识别超时时间:单位秒"
              label="指纹识别超时"
            >
              <a-input-number v-model="state.webinfo.wappalyzertimeout" />
            </a-form-item>
            <a-form-item
              field="spidertimeout"
              tooltip="用于web主动爬虫超时时间:单位秒"
              label="主动爬虫超时"
            >
              <a-input-number v-model="state.webinfo.spidertimeout" />
            </a-form-item>
            <a-form-item
              field="maxdepth"
              tooltip="用于主动爬虫爬取的深度:默认为1,越大时间越久"
              label="主动爬虫深度"
            >
              <a-input-number v-model="state.webinfo.maxdepth" />
            </a-form-item>
            <a-form-item
              field="concurrent"
              tooltip="用于主动爬虫并发数,过大可能会导致WAF拦截"
              label="爬虫并发数"
            >
              <a-input-number v-model="state.webinfo.concurrent" />
            </a-form-item>
            <a-form-item>
              <a-button html-type="submit" :status="'normal'">保存</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="6" title="任务详情">
          <a-card class="general-card">
            <TaskDetail
              :nsq-info="taskState.domainRenderData"
              nsq-id="domain"
            />
            <TaskDetail
              :nsq-info="taskState.portScanRenderData"
              nsq-id="port"
            />
            <TaskDetail
              :nsq-info="taskState.webinfoRenderData"
              nsq-id="webinfo"
            />
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    ClientConfig,
    getClientConfig,
    getNsqInfo,
    NsqInfo,
    setApikey,
    setDomain,
    setNsq,
    setPortScan,
    setWebinfo,
  } from '@/api/engine';
  import { Message } from '@arco-design/web-vue';
  import TaskDetail from './taskDetail/index.vue';

  const { setLoading } = useLoading(true);

  let formConfig: ClientConfig = {
    nsq: {
      nsqd_host: '',
      nsqd_http: '',
      time: 0,
    },
    portscan: {
      verify: false,
      ping: false,
      retries: 1,
      rate: 10000,
      timeout: 2000,
      ports: '1-1024,3389,5900,8080,8443,8686',
      nmap_timeout: 600000,
      waf_num: 0,
      detection: 'top100',
      nsq_timeout: 1200000,
    },
    domain: {
      timeout: 30000,
      max_enum_time: 300000,
      nsq_timeout: 1200000,
    },
    apikey: {
      shodan: '',
      binaryedge: '',
      censys_token: '',
      censys_secret: '',
      certspotter: '',
      github: '',
      spyse: '',
      securitytrails: '',
      threatbook: '',
      urlscan: '',
      virustotal: '',
    },
    webinfo: {
      wappalyzertimeout: 30000,
      spidertimeout: 300000,
      maxdepth: 4,
      concurrent: 20,
    },
    banalyze: null,
  };

  const state = reactive(formConfig);
  const taskState = reactive({
    domainRenderData: {} as NsqInfo,
    portScanRenderData: {} as NsqInfo,
    webinfoRenderData: {} as NsqInfo,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data: any = await getClientConfig('123456@Aa');
      formConfig = data.data;
      state.nsq = formConfig.nsq;
      state.apikey = formConfig.apikey;
      state.banalyze = formConfig.banalyze;
      state.domain = formConfig.domain;
      state.portscan = formConfig.portscan;
      state.webinfo = formConfig.webinfo;
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  const handleNsqSave = async () => {
    setLoading(true);
    try {
      const data: any = await setNsq(state.nsq);
      Message.success(data.msg);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const handlePortScanSave = async () => {
    setLoading(true);
    try {
      const data: any = await setPortScan(state.portscan);
      Message.success(data.msg);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const handleDomainSave = async () => {
    setLoading(true);
    try {
      const data: any = await setDomain(state.domain);
      Message.success(data.msg);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleApiSave = async () => {
    setLoading(true);
    try {
      const data: any = await setApikey(state.apikey);
      Message.success(data.msg);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleWebinfoSave = async () => {
    setLoading(true);
    try {
      const data: any = await setWebinfo(state.webinfo);
      Message.success(data.msg);
    } finally {
      setLoading(false);
    }
  };
  const fetchDomainNsqInfo = async () => {
    setLoading(true);
    try {
      taskState.domainRenderData = await getNsqInfo('subdomain');
    } finally {
      setLoading(false);
    }
  };
  const fetchPortScanNsqInfo = async () => {
    setLoading(true);
    try {
      const data: any = await getNsqInfo('portscan');
      taskState.portScanRenderData = data as NsqInfo;
    } finally {
      setLoading(false);
    }
  };
  const fetchWebinfoNsqInfo = async () => {
    setLoading(true);
    try {
      taskState.webinfoRenderData = await getNsqInfo('webinfo');
    } finally {
      setLoading(false);
    }
  };
  fetchWebinfoNsqInfo();
  fetchPortScanNsqInfo();
  fetchDomainNsqInfo();
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
