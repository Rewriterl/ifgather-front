<template>
  <a-card class="general-card" :title="$t('menu.list.searchDomainTable')">
    <a-row>
      <a-col :flex="1">
        <a-form
          :model="formModel"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-row :gutter="6">
            <a-col :span="12">
              <a-form-item field="CusName" :label="$t('searchTable.scan.name')">
                <a-input
                  v-model="formModel.searchParams.CusName"
                  :placeholder="$t('searchTable.scan.name.placeholder')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                field="Domain"
                :label="$t('searchTable.scan.domain')"
              >
                <a-input
                  v-model="formModel.searchParams.Domain"
                  :placeholder="$t('searchTable.scan.domain.placeholder')"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <a-divider style="height: 44px" direction="vertical" />
      <a-col :flex="'86px'" style="text-align: right">
        <a-space direction="horizontal" :size="18">
          <a-button type="primary" @click="search">
            <template #icon>
              <icon-search />
            </template>
            {{ $t('searchTable.form.search') }}
          </a-button>
          <a-button @click="reset">
            <template #icon>
              <icon-refresh />
            </template>
            {{ $t('searchTable.form.reset') }}
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-divider style="margin-top: 0" />
    <a-table
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      :columns="(cloneColumns as TableColumnData[])"
      :data="renderData"
      :bordered="false"
      :size="size"
      @page-change="onPageChange"
    >
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 + (pagination.page - 1) * pagination.limit }}
      </template>
      <template #flag="{ record }">
        {{ record.flag ? '已扫描' : '未扫描' }}
      </template>
      <template #nsq_flag="{ record }">
        {{ record.nsq_flag ? '已投递' : '未投递' }}
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    PolicyRecord,
    Params,
    domainParams,
    queryManufcDomainList,
  } from '@/api/manager';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const visible = ref(false);
  const form = reactive({
    username: '',
    cusRemark: '',
  });

  const assetsform: domainParams = reactive({
    CusName: '',
    Domain: '',
  });

  const handleClick = () => {
    visible.value = true;
  };

  const clearAssertsForm = () => {
    assetsform.CusName = '';
    assetsform.Domain = '';
  };

  const generateFormModel = () => {
    return {
      searchParams: {
        CusName: '',
        Domain: '',
      },
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<PolicyRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    page: 1,
    limit: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('searchTable.columns.number'),
      dataIndex: 'id',
    },
    {
      title: t('searchTable.columns.name'),
      dataIndex: 'cus_name',
    },
    {
      title: t('searchTable.columns.domain'),
      dataIndex: 'domain',
      slotName: 'domain',
    },
    {
      title: t('searchTable.columns.flag'),
      dataIndex: 'flag',
      slotName: 'flag',
    },
    {
      title: t('searchTable.columns.nsq_flag'),
      dataIndex: 'nsq_flag',
      slotName: 'nsq_flag',
    },
    {
      title: t('searchTable.columns.createdTime'),
      dataIndex: 'create_at',
    },
  ]);
  const fetchData = async (
    params: Params = { page: 1, limit: 10, searchParams: '' }
  ) => {
    setLoading(true);
    try {
      const data: any = await queryManufcDomainList(params);
      renderData.value = data.data;
      pagination.page = params.page;
      pagination.total = data.count;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    const searchParams = JSON.stringify(formModel.value.searchParams);
    fetchData({
      ...basePagination,
      searchParams,
    } as unknown as Params);
  };
  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, page });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'DomainSearch',
  };
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
