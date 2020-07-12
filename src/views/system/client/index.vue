<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="应用标识" prop="clientId">
        <el-input
          v-model="queryParams.clientId"
          placeholder="请输入应用标识"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="应用名称" prop="clientName">
        <el-input
          v-model="queryParams.clientName"
          placeholder="请输入应用名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:client:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:client:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:client:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:client:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="应用标识" align="center" prop="clientId" />
      <el-table-column label="应用名称" align="center" prop="clientName" :show-overflow-tooltip="true" />
      <el-table-column
        label="应用密钥"
        align="center"
        prop="clientSecretStr"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="作用域" align="center" prop="scope" />
      <el-table-column
        label="授权方式"
        width="150"
        align="center"
        prop="authorizedGrantTypes"
        :formatter="typeFormat"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="令牌时效"
        align="center"
        prop="accessTokenValidity"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="刷新时效"
        width="110"
        align="center"
        prop="refreshTokenValidity"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="自动放行"
        align="center"
        prop="autoapprove"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:client:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:client:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用名称" prop="clientName">
              <el-input v-model="form.clientName" placeholder="请输入应用名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用标识" prop="clientId">
              <el-input v-model="form.clientId" placeholder="请输入应用标识" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用密钥" prop="clientSecretStr">
              <el-input v-model="form.clientSecretStr" placeholder="请输入应用密钥" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作用域" prop="scope">
              <el-input v-model="form.scope" placeholder="请输入作用域" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :width="200">
            <el-form-item label="授权方式" prop="authorizedGrantTypes">
              <el-checkbox-group v-model="checkedTypes">
                <el-checkbox
                  v-for="item in typeOptions"
                  :key="item.dictValue"
                  :label="item.dictValue"
                >{{item.dictLabel}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row>
           <el-col :span="12">
            <el-form-item label="自动放行" prop="autoapprove">
               <el-radio v-model="form.autoapprove" label="true">是</el-radio>
               <el-radio v-model="form.autoapprove" label="false">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="令牌时效" prop="accessTokenValidity">
              <el-input v-model="form.accessTokenValidity" placeholder="请输入令牌时效" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刷新时效" prop="refreshTokenValidity">
              <el-input v-model="form.refreshTokenValidity" placeholder="请输入刷新时效" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="回调地址" prop="webServerRedirectUri">
              <el-input v-model="form.webServerRedirectUri" placeholder="请输入回调地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限" prop="authorities">
              <el-input v-model="form.authorities" placeholder="请输入权限" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listClient,
  addClient,
  getClient,
  delClient,
  putClient
} from "@/api/system/client";


export default {
  name: "Config",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 参数表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [
        {
          dictLabel: "密码模式",
          dictValue: "password"
        },
        {
          dictLabel: "授权码模式",
          dictValue: "authorization_code"
        },
        {
          dictLabel: "客户端模式",
          dictValue: "client_credentials"
        },
        {
          dictLabel: "刷新模式",
          dictValue: "refresh_token"
        }
      ],
      checkedTypes: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        clientId: undefined,
        clientName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        clientId: [
          { required: true, message: "应用标识不能为空", trigger: "blur" }
        ],
        clientName: [
          { required: true, message: "应用名称不能为空", trigger: "blur" }
        ],
        clientSecretStr: [
          { required: true, message: "应用密匙不能为空", trigger: "blur" }
        ],
        scope: [
          { required: true, message: "应用域不能为空", trigger: "blur" }
        ],
        authorizedGrantTypes: [
          { required: true, message: "授权方式不能为空", trigger: "blur" }
        ],
        accessTokenValidity: [
          { required: true, message: "令牌时效不能为空", trigger: "blur" }
        ],
        autoapprove: [
          { required: true, message: "是否自动放行不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listClient(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.configList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    // 参数系统内置字典翻译
    typeFormat(row, column) {
      let name ='';
      row.authorizedGrantTypes.split(",").map(t=>{
         name  = name + this.selectDictLabel(this.typeOptions, t)+"|";
      })
      return name;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        clientId: undefined,
        clientName: undefined,
        autoapprove: 'true',
        clientSecretStr: undefined,
        scope: undefined,
        accessTokenValidity: undefined,
        authorizedGrantTypes: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加参数";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const clientId = row.id || this.ids;
      getClient(clientId).then(response => {
        this.form = response.data;
        this.checkedTypes = this.form.authorizedGrantTypes.split(',');
        this.open = true;
        this.title = "修改参数";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.form.authorizedGrantTypes = this.checkedTypes.join(',');
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            putClient(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addClient(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const clientId = row.id || this.ids;
      this.$confirm(
        '是否确认删除应用编号为"' + clientId + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delClient(clientId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有终端数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportClient(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>